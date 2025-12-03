package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

type Sender struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

type To struct {
	Email string `json:"email"`
	Name  string `json:"name"`
}

type EmailRequest struct {
	Sender      Sender `json:"sender"`
	To          []To   `json:"to"`
	Subject     string `json:"subject"`
	HtmlContent string `json:"htmlContent"`
}

func SendWelcomeEmail(email, name string) error {
	apiKey := os.Getenv("BREVO_API_KEY")
	if apiKey == "" {
		return fmt.Errorf("BREVO_API_KEY not set")
	}

	reqBody := EmailRequest{
		Sender: Sender{
			Name:  "EgalDeutsch",
			Email: "no-reply@egaldeutsch.com", // Replace with verified sender
		},
		To: []To{
			{Email: email, Name: name},
		},
		Subject:     "Welcome to EgalDeutsch!",
		HtmlContent: "<html><body><h1>Welcome to EgalDeutsch!</h1><p>We are excited to have you on board. Start learning English conversation starters today!</p></body></html>",
	}

	jsonBody, err := json.Marshal(reqBody)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", "https://api.brevo.com/v3/smtp/email", bytes.NewBuffer(jsonBody))
	if err != nil {
		return err
	}

	req.Header.Set("accept", "application/json")
	req.Header.Set("api-key", apiKey)
	req.Header.Set("content-type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("failed to send email, status: %d", resp.StatusCode)
	}

	return nil
}
