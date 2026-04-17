# EgalDeutsch — Local Development Guide

This guide outlines how to manage the local frontend and backend servers effectively for development and testing.

## Prerequisites
- **Node.js**: Ensure `npm` is installed.
- **Go**: Version 1.22+ installed.
* Ensure you have a valid `.env.local` file at the root containing your `MONGODB_URI`.

---

## 1. Starting the Servers

You need to run the Frontend and Backend in **two separate terminal windows**.

### Terminal A: Next.js Frontend
Access the UI, which handles routing and proxies API calls to the backend.
```bash
npm run dev
```
- **Local URL**: [http://localhost:3000](http://localhost:3000)

### Terminal B: Go Backend API
Handles database logic, authentication, and quiz processing.
```bash
go run main.go
```
- **Local URL**: [http://localhost:8080](http://localhost:8080)
- **Note**: This server automatically loads `.env.local` to connect to your real MongoDB cluster.

---

## 2. Stopping the Servers (Clean Way)

To stop either server gracefully, simply go to the terminal tab where it is running and press:
- **`Ctrl + C`**

This will send an interrupt signal and release the port.

---

## 3. Dealing with "Address already in use" (The Kill Switch)

Sometimes a server might crash or get stuck in the background, preventing you from restarting it (Error: `bind: address already in use`). 

Use these commands to force-kill whatever is holding the ports:

### Free up Backend (Port 8080)
```bash
lsof -ti:8080 | xargs kill -9
```

### Free up Frontend (Port 3000)
```bash
lsof -ti:3000 | xargs kill -9
```

---

## 4. Production Deployment (Vercel)
When you are ready to deploy:
1. `git push` to your main branch.
2. Vercel will automatically use `api/index.go` as the single entry point.
3. Ensure your production Environment Variables (secrets) are added in the Vercel Dashboard.
