---
title: Building RESTful APIs with Golang
slug: building-rest-apis-golang
description: A comprehensive guide to creating robust and scalable REST APIs using Go and best practices
author: EgalDeutsch Team
date: 2024-01-22
tags: golang, api, rest, backend
image: /blog/images/golang-api.svg
---

# Building RESTful APIs with Golang

Building REST APIs is one of Go's strengths. In this guide, we'll explore how to create production-ready RESTful APIs using Go's standard library and popular packages.

![REST API with Golang](/blog/images/golang-api.svg)

## Why Go for REST APIs?

- **Performance**: Go's compiled nature and efficient runtime make it extremely fast
- **Concurrency**: Handle thousands of concurrent requests with goroutines
- **Simplicity**: Clean syntax and minimal boilerplate
- **Great Standard Library**: Built-in HTTP server and JSON support

## Basic HTTP Server

Let's start with a simple HTTP server using Go's standard library:

```go
package main

import (
    "encoding/json"
    "log"
    "net/http"
)

type Response struct {
    Message string `json:"message"`
    Status  string `json:"status"`
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    
    response := Response{
        Message: "Hello, World!",
        Status:  "success",
    }
    
    json.NewEncoder(w).Encode(response)
}

func main() {
    http.HandleFunc("/api/hello", helloHandler)
    
    log.Println("Server starting on :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

## RESTful Endpoints

Let's create a complete CRUD API for managing users:

```go
package main

import (
    "encoding/json"
    "net/http"
    "strings"
)

type User struct {
    ID    string `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

var users = make(map[string]User)

func usersHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    
    switch r.Method {
    case http.MethodGet:
        listUsers(w, r)
    case http.MethodPost:
        createUser(w, r)
    default:
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
    }
}

func listUsers(w http.ResponseWriter, r *http.Request) {
    userList := make([]User, 0, len(users))
    for _, user := range users {
        userList = append(userList, user)
    }
    json.NewEncoder(w).Encode(userList)
}

func createUser(w http.ResponseWriter, r *http.Request) {
    var user User
    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    
    users[user.ID] = user
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(user)
}
```

## Middleware Pattern

Middleware is essential for cross-cutting concerns like logging, authentication, and CORS:

```go
func loggingMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        log.Printf("%s %s", r.Method, r.URL.Path)
        next(w, r)
    }
}

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        
        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusOK)
            return
        }
        
        next(w, r)
    }
}

// Usage
func main() {
    http.HandleFunc("/api/users", 
        corsMiddleware(loggingMiddleware(usersHandler)))
}
```

## Error Handling

Proper error handling is crucial for robust APIs:

```go
type APIError struct {
    Message string `json:"message"`
    Code    int    `json:"code"`
}

func respondWithError(w http.ResponseWriter, code int, message string) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(code)
    json.NewEncoder(w).Encode(APIError{
        Message: message,
        Code:    code,
    })
}

func getUserByID(w http.ResponseWriter, r *http.Request) {
    id := strings.TrimPrefix(r.URL.Path, "/api/users/")
    
    user, exists := users[id]
    if !exists {
        respondWithError(w, http.StatusNotFound, "User not found")
        return
    }
    
    json.NewEncoder(w).Encode(user)
}
```

## Database Integration

Here's how to integrate with MongoDB:

```go
import (
    "context"
    "time"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client

func initDB() error {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    
    var err error
    client, err = mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
    return err
}

func getCollection(name string) *mongo.Collection {
    return client.Database("myapp").Collection(name)
}
```

## Request Validation

Always validate incoming data:

```go
import "errors"

func validateUser(user *User) error {
    if user.Name == "" {
        return errors.New("name is required")
    }
    if user.Email == "" {
        return errors.New("email is required")
    }
    if !strings.Contains(user.Email, "@") {
        return errors.New("invalid email format")
    }
    return nil
}

func createUser(w http.ResponseWriter, r *http.Request) {
    var user User
    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        respondWithError(w, http.StatusBadRequest, "Invalid request body")
        return
    }
    
    if err := validateUser(&user); err != nil {
        respondWithError(w, http.StatusBadRequest, err.Error())
        return
    }
    
    // Create user...
}
```

## Authentication with JWT

Secure your API with JWT tokens:

```go
import (
    "github.com/golang-jwt/jwt/v5"
    "time"
)

var jwtSecret = []byte("your-secret-key")

func generateToken(userID string) (string, error) {
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "user_id": userID,
        "exp":     time.Now().Add(24 * time.Hour).Unix(),
    })
    
    return token.SignedString(jwtSecret)
}

func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        tokenString := r.Header.Get("Authorization")
        if tokenString == "" {
            respondWithError(w, http.StatusUnauthorized, "Missing token")
            return
        }
        
        token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
            return jwtSecret, nil
        })
        
        if err != nil || !token.Valid {
            respondWithError(w, http.StatusUnauthorized, "Invalid token")
            return
        }
        
        next(w, r)
    }
}
```

## Best Practices

1. **Use Context for Timeouts**
```go
ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
defer cancel()
```

2. **Handle Graceful Shutdown**
```go
srv := &http.Server{Addr: ":8080"}
go func() {
    if err := srv.ListenAndServe(); err != nil {
        log.Fatal(err)
    }
}()

// Wait for interrupt signal
c := make(chan os.Signal, 1)
signal.Notify(c, os.Interrupt)
<-c

srv.Shutdown(context.Background())
```

3. **Use Proper HTTP Status Codes**
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Conclusion

Go provides excellent tools for building RESTful APIs. Its standard library is powerful, and with proper structure and middleware, you can build scalable, production-ready APIs.

In our next article, we'll explore advanced topics like rate limiting, caching, and API versioning!

---

**Related Articles:**
- Getting Started with Golang
- Deploying Go Applications to Production

**Resources:**
- [Go HTTP Package Documentation](https://pkg.go.dev/net/http)
- [REST API Best Practices](https://restfulapi.net/)
