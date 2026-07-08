# 🚀 CodeRoom

A real-time collaborative coding platform built for technical interview practice, pair programming, and collaborative problem-solving. CodeRoom enables multiple users to join a shared workspace where they can write code together, collaborate on a synchronized whiteboard, and solve coding problems in real time.

## 🌐 Live Demo

**Demo:** https://coderoom-swart.vercel.app/

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

- ⏱️ **Interview Timer**
  - Built-in timer to simulate coding interview sessions.

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

<img width="959" height="440" alt="image" src="https://github.com/user-attachments/assets/84c469b9-9550-47d4-8759-51d3c0c570b5" />

### Collaborative Workspace

<img width="956" height="437" alt="image" src="https://github.com/user-attachments/assets/5174de2a-59bf-4ef4-ad6a-f393cbb63471" />
<img width="953" height="431" alt="image" src="https://github.com/user-attachments/assets/0750fdec-ac30-40d2-b46a-96d2a188b709" />


### Whiteboard

<img width="946" height="440" alt="image" src="https://github.com/user-attachments/assets/ef954f7f-3709-4df1-8d72-7be9db0f4228" />
<img width="952" height="440" alt="image" src="https://github.com/user-attachments/assets/7563ecd1-497c-4618-8b4f-c8f776e78c6e" />


---

## ⚙️ Getting Started

### Clone the repository

```bash
git clone https://github.com/snehap27/Coderoom.git
cd Coderoom
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
