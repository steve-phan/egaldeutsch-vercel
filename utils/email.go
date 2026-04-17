package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
)

const (
	TemplateWelcome       = 1
	TemplatePasswordReset = 2
)

type Sender struct {
	Name  string `json:"name,omitempty"`
	Email string `json:"email,omitempty"`
}

type To struct {
	Email string `json:"email"`
	Name  string `json:"name,omitempty"`
}

type EmailRequest struct {
	Sender      *Sender                `json:"sender,omitempty"`
	To          []To                   `json:"to"`
	Subject     string                 `json:"subject,omitempty"`
	HtmlContent string                 `json:"htmlContent,omitempty"`
	TemplateID  int                    `json:"templateId,omitempty"`
	Params      map[string]interface{} `json:"params,omitempty"`
}

func SendWelcomeEmail(email, name string) error {
	return sendEmail(EmailRequest{
		To: []To{
			{Email: email, Name: name},
		},
		TemplateID: TemplateWelcome,
		Params: map[string]interface{}{
			"NAME": name,
		},
	})
}

func SendPasswordResetEmail(email, resetLink string) error {
	return sendEmail(EmailRequest{
		To: []To{
			{Email: email},
		},
		TemplateID: TemplatePasswordReset,
		Params: map[string]interface{}{
			"RESET_LINK": resetLink,
		},
	})
}

func sendEmail(reqBody EmailRequest) error {
	apiKey := os.Getenv("BREVO_API_KEY")
	if apiKey == "" {
		fmt.Println("Warning: BREVO_API_KEY not set, skipping email send")
		return nil // In dev, we might not want to fail hard
	}

	// If no sender specified, use default
	if reqBody.Sender == nil {
		reqBody.Sender = &Sender{
			Name:  "EgalDeutsch",
			Email: "no-reply@egaldeutsch.com",
		}
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

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("failed to send email: %s (status code: %d)", resp.Status, resp.StatusCode)
	}

	return nil
}

