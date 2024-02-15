package main

import "gorm.io/gorm"

// ClientMessage Types: authentication, setState,getState, getLeaderboard, sendMessage
type ClientMessage struct {
	Username string      `json:"username"`
	Type     string      `json:"type"`
	Message  interface{} `json:"message"`
}

// Types: chatMessage, gameState, leaderboard, messages, error,success
type ServerMessage struct {
	Type    string      `json:"type"`
	Message interface{} `json:"message"`
}

// Diese drei Types werden in der DB verewigt
type ChatMessage struct {
	gorm.Model `json:"-"`
	Username   string `json:"username"`
	Message    string `json:"message"`
}

type User struct {
	Username     string            `json:"username" gorm:"primaryKey"`
	Password     string            `json:"pw"`
	ChatMessages []ChatMessage     `gorm:"ForeignKey:Username"`
	GameStates   GameStateFromUser `gorm:"ForeignKey:Username"`
}

type GameStateFromUser struct {
	Username string  `json:"username" gorm:"primaryKey"`
	Score    float64 `json:"score"`
	Rest     string  `json:"rest"`
}
