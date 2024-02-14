/*

Beispiel ClientMessage:
AUTH:

{"username":"test2","type":"authentication","message": {"password":"test",}}
MEASSAGE SEND:
{"username": "test","type": "sendMessage","message": "Hello"}

SETSTATE
{"username": "test","type": "setState","message": {"score": 33,"rest": "{....}"}

GETSTATE:
{"username": "test","type": "getState","message": ""}

LEADERBOARD:
{"username": "test","type": "getLeaderboard","message": ""}

*/

package main

import (
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

var clients = make(map[*websocket.Conn]bool) // connected clients

var db *gorm.DB

func main() {

	var dberr error

	db, dberr = gorm.Open(sqlite.Open("./Data/gorm.db"), &gorm.Config{})
	if dberr != nil {
		panic("failed to connect database")
	}

	err := db.AutoMigrate(&ChatMessage{}, &GameStateFromUser{}, &User{})

	if err != nil {
		panic("DB MIGRATION FAILED")
	}

	// Register the WebSocket handler function
	r := gin.Default()

	r.GET("/ws", handleWebSocketAuth)
	r.POST("/registerUser", registerUser)
	r.POST("/usernameCheck", usernameCheck)

	// Broadcast messages to all connected clients
	go handleChatMessages()

	// Start the HTTP server
	log.Println("WebSocket server started on http://localhost:8080/ws")

	_ = r.Run(":8080")

}

func handleWebSocketAuth(c *gin.Context) {
	// Upgrade the HTTP connection to a WebSocket connection
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("Failed to upgrade connection:", err)
		return
	}
	tries := 0
	for {
		if tries >= 3 {
			message := ServerMessage{
				Type:    "error",
				Message: "Too many tries, closing Connection",
			}
			_ = conn.WriteJSON(message)
			_ = conn.Close()
			return
		}

		var msg ClientMessage

		err := conn.ReadJSON(&msg)
		if err != nil {
			answer := ServerMessage{
				Type:    "error",
				Message: "Authenticate yourself first. Object seems to be broken",
			}
			_ = conn.WriteJSON(answer)
			tries++
			continue
		}
		if msg.Type == "authentication" {

			name := msg.Username
			password := msg.Message.(map[string]interface{})["password"].(string)

			fmt.Println(name, password)

			var foundUser User

			result := db.Table("users").Where("username = ?", name).First(&foundUser)
			if result.Error != nil {
				errorMessage := ServerMessage{
					Type:    "error",
					Message: "Database said no. Probably User not found",
				}
				_ = conn.WriteJSON(errorMessage)
				tries++
				continue
			}

			if foundUser.Password == password {
				msg := ServerMessage{
					Type:    "success",
					Message: "Authentication completed",
				}
				_ = conn.WriteJSON(msg)
				go handleWebSocket(conn)
				return
			} else {
				message := ServerMessage{
					Type:    "error",
					Message: "Password is wrong",
				}
				_ = conn.WriteJSON(message)
				tries++
				continue
			}
		} else {
			answer := ServerMessage{
				Type:    "error",
				Message: "Authenticate yourself first!",
			}
			_ = conn.WriteJSON(answer)
			tries++
		}
	}
}

func handleWebSocket(conn *websocket.Conn) {

	// Make sure we close the connection when the function returns
	defer conn.Close()

	// Register our new client
	clients[conn] = true

	// Listen for new messages
	for {
		var msg ClientMessage

		err := conn.ReadJSON(&msg)
		if err != nil {
			log.Printf("error: %v", err)
			delete(clients, conn)
			break
		}

		fmt.Println(msg)

		switch msg.Type {

		case "setState":
			// Check if the user already has a saved game state
			var existingState GameStateFromUser

			result := db.Table("game_state_from_users").Where("username = ?", msg.Username).First(&existingState)

			if errors.Is(result.Error, gorm.ErrRecordNotFound) {

				score, err := msg.Message.(map[string]interface{})["score"].(float64)

				if err {
					conn.WriteJSON(ServerMessage{Type: "error", Message: "Failed to parse score. Wrong Type."})
					break
				}
				rest, err := msg.Message.(map[string]interface{})["rest"].(string)

				if err {
					conn.WriteJSON(ServerMessage{Type: "error", Message: "Failed to parse rest. Wrong Type."})
					break
				}

				fmt.Println("Score:", score, "Rest:", rest)
				newGameState := GameStateFromUser{Username: msg.Username, Score: 33, Rest: rest}

				db.Create(&newGameState)
			} else if result.Error != nil && result.Error != gorm.ErrRecordNotFound {
				log.Println("Failed to find Gamestateforuser entry:", result.Error)
				conn.WriteJSON(ServerMessage{Type: "error", Message: result.Error})
			} else {
				// Replace the existing game state with the new one
				existingState.Score = msg.Message.(map[string]interface{})["score"].(float64)
				existingState.Rest = msg.Message.(map[string]interface{})["rest"].(string)
				result := db.Save(&existingState)
				if result.Error != nil {
					log.Println("Failed to update game state:", result.Error)
					conn.WriteJSON(ServerMessage{Type: "error", Message: "Failed to update game state"})
				}
			}
		case "getState":
			username := msg.Username
			// Find the Gamestateforuser entry that matches the username
			var gameState GameStateFromUser
			result := db.Table("game_state_from_users").Where("username = ?", username).First(&gameState)
			if result.Error != nil {
				log.Println("Failed to find Gamestateforuser entry:", result.Error)
			} else {
				fmt.Println(gameState)
			}
			conn.WriteJSON(ServerMessage{Type: "gameState", Message: gameState})
			fmt.Println(username)
		case "getLeaderboard":
			// Retrieve all entries from game_state_from_users table with the fields username and score, sorted by score
			type tmp struct {
				Username string  `json:"username"`
				Score    float64 `json:"score"`
			}
			var gameStates []tmp
			result := db.Table("game_state_from_users").Select("username, score").Order("score desc").Limit(10).Find(&gameStates)
			if result.Error != nil {
				log.Println("Failed to retrieve game states:", result.Error)
			} else {
				fmt.Println(gameStates)
			}
			conn.WriteJSON(ServerMessage{Type: "leaderboard", Message: gameStates})

		case "sendMessage":
			chatMessage := ChatMessage{Username: msg.Username, Message: msg.Message.(string)}
			db.Create(&chatMessage)
			chatMessageBroadcast <- chatMessage
		default:
			log.Println("Unknown message type:", msg.Type)
		}

		// Send the newly received message to the broadcast channel
	}
}
