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
	return sendEmail(EmailRequest{
		Sender: Sender{
			Name:  "EgalDeutsch",
			Email: "no-reply@egaldeutsch.com", // Replace with verified sender
		},
		To: []To{
			{Email: email, Name: name},
		},
		Subject:     "Welcome to EgalDeutsch!",
		HtmlContent: "<html><body><h1>Welcome to EgalDeutsch!</h1><p>We are excited to have you on board. Start learning English conversation starters today!</p></body></html>",
	})
}

func SendPasswordResetEmail(email, resetLink string) error {
	return sendEmail(EmailRequest{
		Sender: Sender{
			Name:  "EgalDeutsch",
			Email: "no-reply@egaldeutsch.com",
		},
		To: []To{
			{Email: email},
		},
		Subject:     "Reset Your Password",
		HtmlContent: fmt.Sprintf("<html><body><h1>Reset Your Password</h1><p>Click the link below to reset your password:</p><a href=\"%s\">Reset Password</a><p>This link will expire in 1 hour.</p></body></html>", resetLink),
	})
}

func sendEmail(reqBody EmailRequest) error {
	apiKey := os.Getenv("BREVO_API_KEY")
	if apiKey == "" {
		return fmt.Errorf("BREVO_API_KEY not set")
	}

	body, err := json.Marshal(reqBody)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", "https://api.brevo.com/v3/smtp/email", bytes.NewBuffer(body))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("api-key", apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("failed to send email: %s", resp.Status)
	}

	return nil
}

