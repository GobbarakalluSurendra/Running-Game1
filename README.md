# 🐶 Shadow Dog Runner

Welcome to **Shadow Dog Runner**, a professional, high-performance endless runner web application built using the MERN stack (MongoDB, Express, React, Node.js). 

This project is fully deployed:
- **Live Website (Frontend)**: [https://running-game1.netlify.app/](https://running-game1.netlify.app/)
- **Live API Server (Backend)**: [https://running-game1.onrender.com/](https://running-game1.onrender.com/)

---

## ✨ Features

- **High-Performance Game Loop**: Designed using a **Ref-based DOM architecture** inside a `requestAnimationFrame` loop. The player, background, and obstacle elements are individual React components, but their animations and position calculations bypass React's standard state-re-rendering system to guarantee a smooth, stutter-free **60 FPS** gameplay experience.
- **Username Registration & Anti-Duplication**: 
  - Prompts players for a unique username at the starting screen.
  - Performs a case-insensitive check against the database in real-time to prevent duplicate registrations.
  - Remembers returning players via `localStorage`, offering a seamless `"Welcome back, [Name]!"` flow.
- **Dynamic Difficulty**: Obstacle speeds and spawn rates scale dynamically as the player's score increases.
- **Leaderboard Integration**: Automatically logs high scores on death (updating previous records only if the new score exceeds the old one) and renders the top 10 players.
- **Aesthetics & Audio**: Smooth parallax scrolling background, striped scrolling ground for visual feedback, jump sound effects, a game-over sound track, and a camera shake effect on collision.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, CSS3 (Custom animations & styling)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Hosting**:
  - Frontend hosted on **Netlify**
  - Backend hosted on **Render**

---

## 🔌 API Endpoints

The Express backend exposes the following RESTful routes under `/api/scores`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/` | API status and health check |
| **GET** | `/api/scores/check/:username` | Verifies case-insensitively if a username already exists |
| **POST** | `/api/scores` | Saves/upserts a player score (only updates if new score > current high score) |
| **GET** | `/api/scores/leaderboard` | Retrieves the top 10 high scores |

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on port `27017`

### Setup & Commands
1. Clone this repository.
2. Open a terminal in the root project folder.
3. Install dependencies for all directories:
   ```bash
   npm run install:all
   ```
4. Run the development environment concurrently (starts frontend on port `5173` and backend on port `5000`):
   ```bash
   npm run dev
   ```

---

## ⚙️ Deployment Configurations

### Frontend (Netlify)
- **Base directory**: `client`
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Environment variables**: `VITE_API_URL` pointing to your hosted API.
- **Routing Rules**: Includes a `netlify.toml` redirect configuration to prevent 404 errors when reloading path links.

### Backend (Render)
- **Root directory**: `server`
- **Build command**: `npm install`
- **Start command**: `node server.js`
- **Environment variables**: `MONGO_URI` pointing to your MongoDB Atlas connection string.
