package main

import (
	"errors"
	"fmt"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"
	"log"
)

func handleWebSocket(conn *websocket.Conn, username string) {

	// Make sure we close the connection when the function returns
	defer func() {
		conn.Close()
		delete(clients, conn)
	}()

	// Register our new client
	clients[conn] = true

	// Listen for new messages
	for {
		var msg ClientMessage

		err := conn.ReadJSON(&msg)
		if err != nil {
			log.Printf("error: %v", err)
			msgTmp := ServerMessage{
				Type:    "error",
				Message: "Message could not be deserialized",
			}
			_ = conn.WriteJSON(msgTmp)
			continue
		}

		if msg.Username != username {
			msgTmp := ServerMessage{
				Type:    "error",
				Message: "Wrong Username. Disconnecting...",
			}
			_ = conn.WriteJSON(msgTmp)
			delete(clients, conn)
			conn.Close()
			return
		}

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
					continue
				}

				fmt.Println("Score:", score, "Rest:", rest)
				newGameState := GameStateFromUser{Username: msg.Username, Score: 33, Rest: rest}

				db.Create(&newGameState)
			} else if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {
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

	}
}
