# 🚀 CodeRoom

A real-time collaborative coding platform built for technical interview practice, pair programming, and collaborative problem-solving. CodeRoom enables multiple users to join a shared workspace where they can write code together, collaborate on a synchronized whiteboard, and solve coding problems in real time.

## 🌐 Live Demo

**Demo:** <YOUR_VERCEL_LINK>

## ✨ Features

- 👥 **Real-time Collaborative Code Editor**
  - Multiple users can edit code simultaneously with low-latency synchronization using Socket.IO.

- 💻 **Monaco Editor Integration**
  - IDE-like editing experience with syntax highlighting and smooth code editing.

- 🏠 **Room-based Collaboration**
  - Create or join unique interview rooms using a room ID.

- 🟢 **Live User Presence**
  - View active participants in a room in real time.

- 🖱️ **Live Cursor Tracking**
  - See collaborators' cursor positions while they edit.

- 🎨 **Collaborative Whiteboard**
  - Shared drawing canvas synchronized across all connected users.

- ▶️ **Code Execution**
  - Execute code directly within the workspace.

- ⏱️ **Interview Timer**
  - Built-in timer to simulate coding interview sessions.

- 📄 **Problem Statement Panel**
  - Dedicated panel for displaying interview questions alongside the editor.

- 🌙 **Theme Toggle**
  - Switch between light and dark modes.

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Monaco Editor
- Socket.IO Client

### Backend
- Node.js
- Express.js
- Socket.IO

### Deployment
- Vercel (Frontend)
- Render (Backend)

---

## 📸 Screenshots

### Landing Page

> *(Add screenshot here)*

### Collaborative Workspace

> *(Add screenshot here)*

### Whiteboard

> *(Add screenshot here)*

---

## ⚙️ Getting Started

### Clone the repository

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

### Install dependencies

Frontend

```bash
cd client
npm install
```

Backend

```bash
cd server
npm install
```

### Run locally

Backend

```bash
npm start
```

Frontend

```bash
npm run dev
```

---

## 🏗️ Project Structure

```
CodeRoom
│
├── client
│   ├── components
│   ├── pages
│   ├── hooks
│   └── ...
│
├── server
│   ├── socket
│   ├── routes
│   ├── utils
│   └── ...
│
└── README.md
```

---

## 🔄 Real-Time Architecture

```
          User A
             │
             │
        Socket.IO
             │
      Express + Node Server
             │
      Socket.IO Broadcast
             │
 ┌───────────┴───────────┐
 │                       │
User B               User C
```

Events synchronized across connected clients include:

- Code changes
- Cursor movement
- User join/leave events
- Whiteboard drawing
- Room state updates

---

## 🚀 Future Improvements

- Redis adapter for multi-instance Socket.IO deployments
- Database-backed room persistence
- Authentication and user profiles
- Collaborative chat
- File explorer and multi-file support
- Operational Transform (OT) / CRDT-based conflict resolution
- Docker containerization
- CI/CD pipeline

---
