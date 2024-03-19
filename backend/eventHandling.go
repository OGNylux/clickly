package main

import (
	"bufio"
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"os"
	"sort"
	"strconv"
	"time"
)

// Messages to Server:
// Update Score

// Messages from Server:
// Event start
// Event finished

type EventUser struct {
	Name  string
	Score int
}

var eventParticipants = make(map[*websocket.Conn]EventUser)
var currentEvent = false

func eventXY() {
	fmt.Println("d for debug. e for event")
	reader := bufio.NewReader(os.Stdin)
	char, _, err := reader.ReadRune()
	if err != nil {
		log.Fatal(err)
	}
	if char == 'd' {
		fmt.Printf("current connected Users: %v \n", clients)
	} else {
		eventEvent()
	}
	eventXY()
}

func eventEvent() {
	if currentEvent == false {
		fmt.Println("Event will be starting soon")
		startEvent("TestEvent")
		time.Sleep(20 * time.Second)
		endEvent()
	} else {
		fmt.Println("Event läuft bereits")
	}
}

func handleEvent(conn *websocket.Conn, message ClientMessage) {
	if !currentEvent {
		sendError(conn, "Currently is no Event running. Following Message is your Result from last Event")
		//Implement

		return
	}

	if _, ok := eventParticipants[conn]; !ok {
		user := EventUser{
			Score: 0,
			Name:  message.Username,
		}
		eventParticipants[conn] = user
	}

	score, oks := message.Message.(map[string]interface{})["score"].(string)
	if !oks {
		sendError(conn, "Failed to parse score. Wrong Type (Needs string).")
		return
	}

	value, errorConv := strconv.Atoi(score)
	if errorConv != nil {
		sendError(conn, "Could not parse score. Send score was: "+score)
		return
	}

	tmp := EventUser{
		Score: value,
		Name:  eventParticipants[conn].Name,
	}

	eventParticipants[conn] = tmp

	fmt.Println(eventParticipants[conn].Score)
}

func startEvent(eventType string) {
	fmt.Println("Event started")
	currentEvent = true
	eventParticipants = make(map[*websocket.Conn]EventUser)
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

	sortedParticipants := sortParticipants(eventParticipants)

	var leaderBoard = make([]EventUser, 10)

	for i := 0; i < len(leaderBoard); i++ {
		if i >= len(sortedParticipants) {
			leaderBoard = append([]EventUser(nil), leaderBoard[:len(sortedParticipants)]...)
			break
		}
		leaderBoard[i] = sortedParticipants[i].EventUser
	}

	fmt.Println(leaderBoard)

	for i, element := range sortedParticipants {
		type EndEvent struct {
			Score             int
			Leaderboard       []EventUser
			Place             int
			ParticipantsCount int
		}

		var result = EndEvent{
			Score:             element.EventUser.Score,
			Leaderboard:       leaderBoard,
			Place:             i + 1,
			ParticipantsCount: len(eventParticipants),
		}

		sMessage := ServerMessage{
			Type:    "eventEnd",
			Message: result,
		}

		_ = element.Key.WriteJSON(sMessage)
	}
}

func sortParticipants(eventParticipants map[*websocket.Conn]EventUser) EventLeaderboard {
	pl := make(EventLeaderboard, len(eventParticipants))
	i := 0
	for k, v := range eventParticipants {
		pl[i] = eventParticipantStruct{k, v}
		i++
	}
	sort.Sort(sort.Reverse(pl))
	return pl
}

type eventParticipantStruct struct {
	Key       *websocket.Conn
	EventUser EventUser
}

type EventLeaderboard []eventParticipantStruct

func (p EventLeaderboard) Len() int           { return len(p) }
func (p EventLeaderboard) Less(i, j int) bool { return p[i].EventUser.Score < p[j].EventUser.Score }
func (p EventLeaderboard) Swap(i, j int)      { p[i], p[j] = p[j], p[i] }
