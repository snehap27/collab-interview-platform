import "../../styles/navbar.css";
import { useState } from "react";


function Navbar({
  roomId,
  userCount,
  onCopyRoomId,
  onLeaveRoom,
  themeToggle,
  timer,
  timerRunning,
  onStartTimer,
  onPauseTimer,
  onResetTimer
}) {
  const [showToast, setShowToast] = useState(false);

  const handleCopyClick = () => {
    onCopyRoomId();
    setShowToast(true);

    window.setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <h1>CodeRoom</h1>
      </div>

      <div className="navbar-room">
        <span className="room-label">
          Room: {roomId}
        </span>

        <button
          className="copy-button"
          aria-label="Copy room ID"
          onClick={handleCopyClick}
        >
          📋
        </button>
      </div>

      <div className="navbar-actions">
        <div className="timer-controls">

          {timerRunning ? (
            <button
              className="timer-button"
              onClick={onPauseTimer}
            >
              ⏸
            </button>
          ):(
            <button
            className="timer-button"
            onClick={onStartTimer}
            >
              ▶
            </button>
          )}

          <button
            className="timer-button"
            onClick={onResetTimer}
          >
            🔄
          </button>

          <div className="timer-box">
            🕒 {timer}
          </div>

      </div>
        {themeToggle}

        <div className="user-badge">
          👥 {userCount} {userCount === 1 ? "user" : "users"}
        </div>

        <button
          className="leave-btn"
          onClick={onLeaveRoom}
        >
          Leave
        </button>

      </div>

      <div className={`toast ${showToast ? "visible" : ""}`}>
        Room ID copied
      </div>
    </header>
  );
}

export default Navbar;