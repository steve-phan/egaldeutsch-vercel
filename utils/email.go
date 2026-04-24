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
	TemplateWelcome       = 4
	TemplatePasswordReset = 3
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
			"userName": name,
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
			"resetURL": resetLink,
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
		fmt.Printf("Error marshaling email body: %v\n", err)
		return err
	}

	req, err := http.NewRequest("POST", "https://api.brevo.com/v3/smtp/email", bytes.NewBuffer(body))
	if err != nil {
		fmt.Printf("Error creating email request: %v\n", err)
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("api-key", apiKey)

	fmt.Printf("Sending email to %s with template %d...\n", reqBody.To[0].Email, reqBody.TemplateID)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error sending email: %v\n", err)
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		var errResp map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&errResp)
		fmt.Printf("Failed to send email: %s (status code: %d), Response: %v\n", resp.Status, resp.StatusCode, errResp)
		return fmt.Errorf("failed to send email: %s (status code: %d)", resp.Status, resp.StatusCode)
	}

	fmt.Printf("Email successfully sent to %s\n", reqBody.To[0].Email)
	return nil
}
