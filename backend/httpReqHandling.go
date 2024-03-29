package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

func registerUser(c *gin.Context) {
	type Tmp struct {
		Name     string `json:"name"`
		Password string `json:"password"`
	}

	var msg Tmp

	err := c.ShouldBindJSON(&msg)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse request body"})
		return
	}

	fmt.Println(msg.Name)

	name := msg.Name
	password := msg.Password

	// Check if username is already taken
	var existingUser User

	result := db.Table("users").Where("username = ?", name).First(&existingUser)
	if result.Error == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Username already taken"})
		return
	}

	// Create new user in the database
	newUser := User{
		Username: name,
		Password: password,
	}

	result = db.Create(&newUser)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// Return success response
	c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})

}

func usernameCheck(c *gin.Context) {
	body, err := c.GetRawData()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read request body"})
		return
	}

	name := string(body)
	// Check if username is already taken
	var existingUser User
	result := db.Table("users").Where("username = ?", name).First(&existingUser)
	if result.Error == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Username already taken"})
		return
	}

	// Return success response
	c.Status(http.StatusOK)

}
