function UsersPanel({ users, currentUsername }) {
  const getInitials = (name) =>
    name
      .split(" ")
      .map((part) => part[0] || "")
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <section className="users-panel">
      <h2>Active Users</h2>

      <ul>
        {users.map((u) => {
          const isCurrentUser = u.username === currentUsername;
          return (
            <li className="user-card" key={u.socketId}>
              <div className="user-avatar">
                {getInitials(u.username || "?")}
              </div>
              <div className="user-info">
                <span className="user-name">{u.username}</span>
                {isCurrentUser && <span className="user-self">(You)</span>}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default UsersPanel;