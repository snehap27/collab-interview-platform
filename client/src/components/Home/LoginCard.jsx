function LoginCard({
  username,
  setUsername,
  roomId,
  setRoomId,
  error,
  createRoom,
  isCreating,
  joinRoom,
}) {
  return (
    <div className="login-card">
      {isCreating && (
        <div className="creating-room" aria-live="polite">Creating Room...</div>
      )}
      <h2>Welcome 👋</h2>

<p className="login-subtitle">
Start a new interview room or join an existing one.
</p>

      <label>
        Name
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Enter your name"
          disabled={isCreating}
        />
      </label>

      {error && <p className="error">{error}</p>}

      <button
        type="button"
        onClick={createRoom}
        disabled={isCreating}
      >
        Create Room
      </button>

      <form onSubmit={joinRoom}>
        <input
          type="text"
          value={roomId}
          onChange={(event) => setRoomId(event.target.value)}
          placeholder="Enter Room ID"
          disabled={isCreating}
        />

        <button type="submit" disabled={isCreating}>
          Join Room
        </button>
      </form>

    </div>
  );
}

export default LoginCard;