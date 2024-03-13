package main

import (
	"errors"
	"fmt"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"
	"log"
	"reflect"
)

func sendError(conn *websocket.Conn, msg string) {
	msgTmp := ServerMessage{
		Type:    "error",
		Message: msg,
	}
	_ = conn.WriteJSON(msgTmp)
}

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
			fmt.Printf("error: %v", err)
			sendError(conn, "Message could not be deserialized. Closing connection...")
			return
		}

		if msg.Username != username {
			sendError(conn, "Wrong Username. Disconnecting...")
			return
		}

		switch msg.Type {
		case "eventScore":
			handleEvent(conn, msg)
		case "setState":
			handleSetState(conn, msg)
		case "getState":
			handleGetState(conn, msg.Username)
		case "getLeaderboard":
			handleGetLeaderboard(conn)
		case "sendMessage":
			chatMessage := ChatMessage{Username: msg.Username, Message: msg.Message.(string)}
			db.Create(&chatMessage)
			chatMessageBroadcast <- chatMessage
		default:
			log.Println("Unknown message type:", msg.Type)
			sendError(conn, "Unknown message type: "+msg.Type)
		}

	}
}

func handleSetState(conn *websocket.Conn, msg ClientMessage) {

	score, oks := msg.Message.(map[string]interface{})["score"].(float64)
	if !oks {
		sendError(conn, "Failed to parse score. Wrong Type (Needs float64). Had Type: "+reflect.TypeOf(msg.Message.(map[string]interface{})["score"]).String())
		return
	}

	fmt.Println(score)

	rest, okr := msg.Message.(map[string]interface{})["rest"].(string)

	if !okr {
		sendError(conn, "Failed to parse rest. Wrong Type (Needs String). Had Type: "+reflect.TypeOf(msg.Message.(map[string]interface{})["rest"]).String())
		return
	}

	fmt.Println(rest)

	// Check if the user already has a saved game state
	var existingState GameStateFromUser

	result := db.Table("game_state_from_users").Where("username = ?", msg.Username).First(&existingState)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		newGameState := GameStateFromUser{Username: msg.Username, Score: score, Rest: rest}
		db.Create(&newGameState)
	} else if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		sendError(conn, result.Error.Error())
	} else {
		// Replace the existing game state with the new one
		existingState.Score = score
		existingState.Rest = rest
		result := db.Save(&existingState)
		if result.Error != nil {
			log.Println("Failed to update game state:", result.Error)
			sendError(conn, result.Error.Error())
		}
	}
}

func handleGetState(conn *websocket.Conn, username string) {
	// Find the Gamestatefromuser entry that matches the username
	var gameState GameStateFromUser
	result := db.Table("game_state_from_users").Where("username = ?", username).First(&gameState)
	if result.Error != nil {
		log.Println("Failed to find Gamestateforuser entry:", result.Error)
	} else {
		fmt.Println(gameState)
	}
	_ = conn.WriteJSON(ServerMessage{Type: "gameState", Message: gameState})
}

func handleGetLeaderboard(conn *websocket.Conn) {
	// Retrieve all entries from game_state_from_users table with the fields username and score, sorted by score
	type tmp struct {
		Username string  `json:"username"`
		Score    float64 `json:"score"`
	}
	var gameStates []tmp
	result := db.Table("game_state_from_users").Select("username, score").Order("score desc").Limit(10).Find(&gameStates)
	if result.Error != nil {
		sendError(conn, "Error in DB:"+result.Error.Error())
		return
	}
	_ = conn.WriteJSON(ServerMessage{Type: "leaderboard", Message: gameStates})
}
