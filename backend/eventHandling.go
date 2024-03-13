package main

import (
	"bufio"
	"fmt"
	"github.com/gorilla/websocket"
	"os"
	"reflect"
	"strconv"
	"time"
)

// Messages to Server:
// Update Score

// Messages from Server:
// Event start
// Event finished

var eventParticipants = make(map[*websocket.Conn]int)
var currentEvent = false

func eventXY() {
	reader := bufio.NewReader(os.Stdin)
	fmt.Print("To Start an Event Type something an hit enter")
	_, _ = reader.ReadString('\n')
	fmt.Println("Event will start")
	startEvent("TestEvent")
	time.Sleep(1 * time.Minute)
	endEvent()
	eventXY()
}

func handleEvent(conn *websocket.Conn, message ClientMessage) {
	if !currentEvent {
		sendError(conn, "Currently is no Event running. Following Message is your Result from last Event")
		//Implement

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

	fmt.Println("New Score for " + message.Username + "New Score is " + strconv.Itoa(int(score)))
	eventParticipants[conn] = int(score)
}

func startEvent(eventType string) {
	fmt.Println("Event started")
	currentEvent = true
	eventParticipants = make(map[*websocket.Conn]int)
	for conn := range clients {
		eventStartMessage := ServerMessage{
			Type:    "EventStart",
			Message: eventType,
		}
		fmt.Println("send start message to somebody")
		_ = conn.WriteJSON(eventStartMessage)
	}
}

func endEvent() {
	fmt.Println("Event stopped")
	currentEvent = false
	for conn := range eventParticipants {
		type EndEvent struct {
			Score       int
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
