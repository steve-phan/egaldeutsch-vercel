package api

import (
	"net/http"

	"egaldeutsch-vercel/router"
)

// The global router instantiated once per cold start
var mux = router.NewRouter()

// Handler is the SINGLE entrypoint for Vercel Serverless.
// All requests dynamically matching /api/* are rewritten here by vercel.json.
func Handler(w http.ResponseWriter, r *http.Request) {
	mux.ServeHTTP(w, r)
}
