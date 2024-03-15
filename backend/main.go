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
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

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
	//r.Use(cors.Default())

	r.GET("/ws", handleWebSocketAuth)
	r.POST("/registerUser", registerUser)
	r.POST("/usernameCheck", usernameCheck)

	// Broadcast messages to all connected clients
	go handleChatMessages()

	go eventXY()

	// Start the HTTP server
	fmt.Println("WebSocket server started on http://localhost:18143/ws")

	_ = r.Run(":18143")

}

func handleWebSocketAuth(c *gin.Context) {

	// BIG DANGER: CORS IS ALLOWED FOR EVERYONE
	var upgrade = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	// Upgrade the HTTP connection to a WebSocket connection
	conn, err := upgrade.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		fmt.Println("Failed to upgrade connection:", err)
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
				go handleWebSocket(conn, foundUser.Username)
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
