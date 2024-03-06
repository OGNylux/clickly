package main

import (
	"github.com/gorilla/websocket"
	"reflect"
)

// Messages to Server:
// Update Score

// Messages from Server:
// Event start
// Event finished

var eventParticipants = make(map[*websocket.Conn]float64)
var currentEvent = false

func handleEvent(conn *websocket.Conn, message ClientMessage) {
	if !currentEvent {
		sendError(conn, "Currently is no Event running")
		return
	}

	if _, ok := eventParticipants[conn]; !ok {
		eventParticipants[conn] = 0
	}

	score, oks := message.Message.(map[string]interface{})["score"].(float64)

	if !oks {
		sendError(conn, "Failed to parse score. Wrong Type (Needs float64). Had Type: "+reflect.TypeOf(message.Message.(map[string]interface{})["score"]).String())
		return
	}

	eventParticipants[conn] = score
}

func startEvent(eventType string) {
	currentEvent = true
	for conn := range clients {
		eventStartMessage := ServerMessage{
			Type:    "EventStart",
			Message: eventType,
		}
		_ = conn.WriteJSON(eventStartMessage)
	}
}

func endEvent() {
	currentEvent = false
	for conn := range eventParticipants {

		type EndEvent struct {
			Score       float64
			Leaderboard string
			Place       int
		}

		var result = EndEvent{
			Score:       eventParticipants[conn],
			Leaderboard: " ",
			Place:       2,
		}

		sMessage := ServerMessage{
			Type:    "eventEnd",
			Message: result,
		}

		conn.WriteJSON(sMessage)
	}
}
