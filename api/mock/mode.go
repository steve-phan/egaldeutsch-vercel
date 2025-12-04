package mock

import (
	"os"
)

// IsMockMode returns true if the application should use mock data instead of MongoDB
func IsMockMode() bool {
	return os.Getenv("USE_MOCK_DB") == "true" || os.Getenv("MONGODB_URI") == ""
}
