package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

var (
	words []string
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	words = strings.Split(os.Getenv("WORDS"), ",")
	if len(words) != 2 {
		log.Fatal("WORDS must be 3 words separated by commas")
	}

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3001"},
		AllowedMethods:   []string{"POST"},
		MaxAge:           3600,
		AllowedHeaders:   []string{"Access-Control-Allow-Origin", "Content-Type"},
		AllowCredentials: true,
		Debug:            false,
	})

	r := mux.NewRouter()
	r.HandleFunc("/fizzbuzz", FizzBuzzHandler).Methods("POST")

	port := os.Getenv("PORT")
	log.Printf("Server starting on port: %s", port)
	if err := http.ListenAndServe(fmt.Sprintf(":%s", port), c.Handler(r)); err != nil {
		log.Fatalf("Error starting server on port %s %v", port, err)
	}
}

type Res struct {
	Count int `json:"count"`
}

func FizzBuzzHandler(w http.ResponseWriter, r *http.Request) {
	var count Res
	if err := json.NewDecoder(r.Body).Decode(&count); err != nil {
		Response(w, http.StatusBadRequest, err)
		return
	}

	if count.Count%3 == 0 && count.Count%5 == 0 {
		Response(w, http.StatusOK, fmt.Sprintf("%s%s", words[0], words[1]))
		return
	}

	if count.Count%3 == 0 {
		Response(w, http.StatusOK, words[0])
		return
	}

	if count.Count%5 == 0 {
		Response(w, http.StatusOK, words[1])
		return
	}
}

func Response(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  status,
		"message": data,
	})
}
