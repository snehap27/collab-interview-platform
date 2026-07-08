function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <button
      className="theme-toggle"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? "☀" : "🌙"}
    </button>
  );
}

export default ThemeToggle;