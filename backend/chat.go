package main

import "log"

var chatMessageBroadcast = make(chan ChatMessage) // broadcast channel

func handleChatMessages() {
	for {
		msg := <-chatMessageBroadcast
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
