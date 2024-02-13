package main

import (
	//"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

var clients = make(map[*websocket.Conn]bool)     // connected clients
var chatMessageProdcast = make(chan ChatMessage) // broadcast channel

// Types: setState, getLeaderboard, sendMessage
type ClientMessage struct {
	Username string      `json:"username"`
	Type     string      `json:"type"`
	Message  interface{} `json:"message"`
}

// Types: chatMessage, gameState, leaderboard, messages
type ServerMessage struct {
	Type    string      `json:"type"`
	Message interface{} `json:"message"`
}

type ChatMessage struct {
	gorm.Model `json:"-"`
	Username   string `json:"username" gorm:"unique"`
	Message    string `json:"message"`
}

type User struct {
	UserName     string            `json:"username" gorm:"primaryKey"`
	PW           string            `json:"pw"`
	ChatMessages []ChatMessage     `gorm:"ForeignKey:UserID"`
	GameStates   GameStateFromUser `gorm:"ForeignKey:UserID"`
}

type GameStateFromUser struct {
	Username string  `json:"username" gorm:"primaryKey"`
	Score    float64 `json:"score"`
	Rest     string  `json:"rest"`
}

var db *gorm.DB

func main() {

	var dberr error

	db, dberr = gorm.Open(sqlite.Open("./Data/gorm.db"), &gorm.Config{})
	if dberr != nil {
		panic("failed to connect database")
	}

	db.AutoMigrate(&ChatMessage{}, &GameStateFromUser{})

	// Register the WebSocket handler function
	http.HandleFunc("/ws", handleWebSocket)

	// Broadcast messages to all connected clients
	go handleChatMessages()

	// Start the HTTP server
	log.Println("WebSocket server started on http://localhost:8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {

	// Upgrade the HTTP connection to a WebSocket connection
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Failed to upgrade connection:", err)
		return
	}

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

			if result.Error == gorm.ErrRecordNotFound {

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
			chatMessageProdcast <- chatMessage
		default:
			log.Println("Unknown message type:", msg.Type)
		}

		// Send the newly received message to the broadcast channel
	}
}

func handleChatMessages() {
	for {
		msg := <-chatMessageProdcast
		// Write message back to the WebSocket connection
		for client := range clients {
			returnMessage := ServerMessage{Type: "chatMessage", Message: msg}
			err := client.WriteJSON(returnMessage)
			if err != nil {
				log.Printf("error: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}

/*

Beispiel ClientMessage:

MEASSAGE SEND:
{"username": "test","type": "sendMessage","message": "Hello"}

SETSTATE
{"username": "test","type": "setState","message": {"score": 33,"rest": "{....}"}

GETSTATE:
{"username": "test","type": "getState","message": ""}

LEADERBOARD:
{"username": "test","type": "getLeaderboard","message": ""}

*/
