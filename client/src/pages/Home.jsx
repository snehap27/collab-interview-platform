import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/Home/HeroSection";
import LoginCard from "../components/Home/LoginCard";
import PreviewPanel from "../components/Home/PreviewPanel";
import AnimatedBackground from "../components/Home/AnimatedBackground";
import "../styles/home.css";

function Home() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const createRoom = () => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("Please enter your name before creating a room.");
      return;
    }

    setError("");
    localStorage.setItem("coderoomUsername", trimmedUsername);

    setIsCreating(true);
    fetch("https://coderoom-fi7c.onrender.com/room", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        navigate(`/room/${data.room.roomId}`, {
          state: { username: trimmedUsername },
        });
      })
      .catch(() => {
        setError("Failed to create room. Please try again.");
      })
      .finally(() => setIsCreating(false));
  };

  const joinRoom = (event) => {
    event.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedRoomId = roomId.trim();

    if (!trimmedUsername) {
      setError("Please enter your name before joining a room.");
      return;
    }

    if (!trimmedRoomId) {
      setError("Please enter a room ID.");
      return;
    }

    setError("");
    localStorage.setItem("coderoomUsername", trimmedUsername);

    navigate(`/room/${trimmedRoomId}`, {
      state: { username: trimmedUsername },
    });
  };

  return (
  <>
    <AnimatedBackground />

    <main className="home-page">

      <HeroSection />

      <LoginCard
        username={username}
        setUsername={setUsername}
        roomId={roomId}
        setRoomId={setRoomId}
        error={error}
        createRoom={createRoom}
        isCreating={isCreating}
        joinRoom={joinRoom}
      />

      <PreviewPanel />

    </main>
  </>
);
}

export default Home;