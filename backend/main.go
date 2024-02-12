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
	UserName string `json:"username" gorm:"primaryKey"`
	PW	   string `json:"pw"`
	ChatMessages []ChatMessage `gorm:"ForeignKey:UserID"`
    GameStates   GameStateFromUser `gorm:"ForeignKey:UserID"`
}

type GameStateFromUser struct {
	Username string `json:"username" gorm:"primaryKey"`
	Score    int    `json:"score"`
	Rest     string `json:"rest"`
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
			gameState := GameStateFromUser{Username: msg.Username, Score: msg.Message.(map[string]interface{})["score"].(int), Rest: msg.Message.(map[string]interface{})["rest"].(string)}
			db.Create(&gameState)
			fmt.Println(gameState)
		case "getState":
			username := msg.Username
			fmt.Println(username)
		case "getLeaderboard":
			conn.WriteJSON(ServerMessage{Type: "leaderboard", Message: "Hello"})
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
{"username": "test","type": "sendMessage","message": "Hello"}
{"username": "test","type": "setState","message": GAMESTATE AS JSON}


Game State Formatting:
{
	"score": SCORE,
	"rest": "{....}",
}
*/
