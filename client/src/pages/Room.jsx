import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { io } from "socket.io-client";
import Navbar from "../components/common/Navbar";
import UsersPanel from "../components/Users/UsersPanel";
import EditorPanel from "../components/Editor/EditorPanel";
import WhiteboardPanel from "../components/Whiteboard/WhiteboardPanel";
import OutputPanel from "../components/Output/OutputPanel";
import RoomHeader from "../components/Room/RoomHeader";
import ProblemPanel from "../components/Problem/ProblemPanel";
import RoomLayout from "../components/Room/RoomLayout";
import LanguageSelector from "../components/common/LanguageSelector";
import RunButton from "../components/common/RunButton";
import ThemeToggle from "../components/common/ThemeToggle";

// this is the default code that will be displayed in the editor when a user joins a room for the first time.
const DEFAULT_CODE = `function hello() {
  console.log("Welcome to CodeRoom");
}`;

/*
 * The Room component is responsible for rendering the collaborative coding environment. 
 * It connects to the server via WebSocket, fetches room data, and manages the state of the code editor and active users.

 * the function Room uses useEffect to handle side effects such as connecting to the WebSocket server, 
 * fetching room data, and updating the code editor state.
 */
function Room() {
  const editorRef = useRef(null); // useRef is used to persist the editor instance across re-renders without causing re-renders itself
  const monacoRef = useRef(null); // store the Monaco API instance for decorations
  const remoteCursorRef = useRef({}); // useRef is used to persist the remote cursor position across re-renders without causing re-renders itself
  const canvasRef = useRef(null); // useRef is used to persist the canvas instance across re-renders without causing re-renders itself
  const contextRef = useRef(null); // useRef is used to persist the canvas context across re-renders without causing re-renders itself
  const isDrawingRef = useRef(false); // useRef is used to persist the drawing state across re-renders without causing re-renders itself
  const lastPositionRef = useRef({ x: 0, y: 0 }); // track the last pointer position for drawing
  const pendingStrokesRef = useRef([]); // buffer incoming strokes until the canvas is ready
  const { roomId } = useParams(); // get the roomId from the URL parameters
  const location = useLocation(); // get the location object to access state passed from the previous page
  const socketRef = useRef(null); // useRef is used to persist the socket connection across re-renders without causing re-renders itself
  const codeRef = useRef(DEFAULT_CODE); // used as a source of truth for the code editor content to avoid unnecessary re-renders (i.e. when the code changes), as this can lead to feeling laggy or unresponsive. Instead, we can use a ref to store the current code value and only update the state when necessary.
  const username =
    location.state?.username ||
    localStorage.getItem("coderoomUsername") ||
    "Guest"; // get the username from location state, localStorage, or default to "Guest"
  const [room, setRoom] = useState(null); // useState is used to manage the state of the room data, loading state, error state, active users, and code editor content
  const [isLoading, setIsLoading] = useState(true); // loading state to indicate whether the room data is being fetched
  const [error, setError] = useState(""); // error state to display any errors that occur while fetching room data
  const [users, setUsers] = useState([]); // active users in the room
  const [output, setOutput] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === null) {
      return true; // default dark mode
    }

    return savedTheme === "dark";
  });
  const [code, setCode] = useState(DEFAULT_CODE); 
  const [language, setLanguage] = useState("javascript");
  const [brushColor, setBrushColor] = useState("black");
  const [brushSize, setBrushSize] = useState(2);
  useEffect(() => {
  console.log("Brush color:", brushColor);
}, [brushColor]);
  useEffect(() => {
    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);// code editor content
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);
  useEffect(() => {
        if (!timerRunning) return;

        const interval = setInterval(() => {
          setElapsedTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timerRunning]);


  useEffect(() => {
    const socket = io("https://coderoom-fi7c.onrender.com");
    socketRef.current = socket;

    const handleConnect = () => {
      console.log("Connected to server");
      socket.emit("join-room", {
        username,
        roomId,
      });
    };

    const handleRoomUsers = (nextUsers) => {
      setUsers(nextUsers); // update the list of active users in the room
    };

    const handleCodeUpdate = (nextCode) => {
      if (nextCode !== codeRef.current) {
        codeRef.current = nextCode;
        setCode(nextCode);
      }
    };
    const handleCursorUpdate = ({ userId, position }) => {
      if (!editorRef.current || !monacoRef.current || !userId || !position) return;

      const oldDecorations = remoteCursorRef.current[userId] || [];
      const newDecorations = editorRef.current.deltaDecorations(
        oldDecorations,
        [
          {
            range: new monacoRef.current.Range(
              position.lineNumber,
              position.column,
              position.lineNumber,
              position.column
            ),
            options: {
              className: "remote-cursor",
            },
          },
        ]
      );
      delete remoteCursorRef.current[userId]; // remove the old decorations for this user
      remoteCursorRef.current[userId] = newDecorations; // store the new decorations for this user
    };
    const handleWhiteboardData = (stroke) => {
      if (!contextRef.current) {
        pendingStrokesRef.current.push(stroke);
        return;
      }

      drawStroke(stroke);
    };

    const handleWhiteboardHistory = (history) => {
      if (!Array.isArray(history) || history.length === 0) return;

      history.forEach((stroke) => {
        if (!contextRef.current) {
          pendingStrokesRef.current.push(stroke);
        } else {
          drawStroke(stroke);
        }
      });
    };

    socket.on("whiteboard-data", handleWhiteboardData);
    socket.on("whiteboard-history", handleWhiteboardHistory);
    socket.on("cursor-update", handleCursorUpdate);
    socket.on("connect", handleConnect);
    socket.on("room-users", handleRoomUsers);
    socket.on("code-update", handleCodeUpdate);

    return () => {
      socket.off("whiteboard-data", handleWhiteboardData);
      socket.off("whiteboard-history", handleWhiteboardHistory);
      socket.off("cursor-update", handleCursorUpdate);
      socket.off("connect", handleConnect);
      socket.off("room-users", handleRoomUsers);
      socket.off("code-update", handleCodeUpdate);
      socket.disconnect();
    };
  }, [roomId, username]);

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  useEffect(() => {
    fetch(`https://coderoom-fi7c.onrender.com/room/${roomId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Room not found");
        }

        return res.json();
      })
      .then((data) => {
        setRoom(data);
        setError("");
      })
      .catch(() => {
        setRoom(null);
        setError("Room Not Found");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [roomId]);

  // Initialize canvas context after ref is set
  useEffect(() => {
    const setupCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        console.log("Canvas still not ready, will retry");
        requestAnimationFrame(setupCanvas);
        return;
      }

      console.log("Canvas found, initializing");
      const context = canvas.getContext("2d");
      context.lineCap = "round";
      context.lineJoin = "round";
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);

      contextRef.current = context;
      console.log("Canvas context initialized");
    };

    requestAnimationFrame(setupCanvas);
  }, []);

  const getCanvasCoordinates = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

const drawStroke = ({
  startX,
  startY,
  endX,
  endY,
  color,
  size,
}) => {

  console.log("Drawing with:", color, size);

  const context = contextRef.current;

  if (!context) {
    pendingStrokesRef.current.push({
      startX,
      startY,
      endX,
      endY,
      color,
      size,
    });
    return;
  }

  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);

  context.strokeStyle = color;
  context.lineWidth = size;
  context.lineCap = "round";

  context.stroke();
  context.closePath();
};

  const handleCodeChange = (value) => {
    const nextCode = value ?? "";
    codeRef.current = nextCode;
    setCode(nextCode);

    if (socketRef.current?.connected) {
      socketRef.current.emit("code-change", {
        roomId,
        code: nextCode,
      });
    }
  };
  const handleRun = () => {
      setOutput("Running...\n\nFeature coming in Phase 16.");
    };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

 useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const onPointerDown = (event) => {
    lastPositionRef.current = getCanvasCoordinates(event);
    isDrawingRef.current = true;
  };

  const onPointerMove = (event) => {
    if (!isDrawingRef.current) return;

    const nextPosition = getCanvasCoordinates(event);
    const previousPosition = lastPositionRef.current;

    drawStroke({
      startX: previousPosition.x,
      startY: previousPosition.y,
      endX: nextPosition.x,
      endY: nextPosition.y,
      color: brushColor,
      size: brushSize,
    });

    if (socketRef.current?.connected) {
      socketRef.current.emit("whiteboard-draw", {
        roomId,
        stroke: {
          startX: previousPosition.x,
          startY: previousPosition.y,
          endX: nextPosition.x,
          endY: nextPosition.y,
          color: brushColor,
          size: brushSize,
        },
      });
    }

    lastPositionRef.current = nextPosition;
  };

  const onPointerUp = () => {
    isDrawingRef.current = false;
  };

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);

  return () => {
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  };
}, [brushColor, brushSize, roomId]);
  const handleCopyRoomId = () => {
  navigator.clipboard.writeText(roomId);
  };
  const handleLeaveRoom = () => {
  socketRef.current?.disconnect();
  window.location.href = "/";
  };
  const formatTime = (seconds) => {
      const hrs = Math.floor(seconds / 3600)
        .toString()
        .padStart(2, "0");

      const mins = Math.floor((seconds % 3600) / 60)
        .toString()
        .padStart(2, "0");

      const secs = (seconds % 60)
        .toString()
        .padStart(2, "0");

      return `${hrs}:${mins}:${secs}`;
  };
  const handleStartTimer = () => {
  setTimerRunning(true);
  };

  const handlePauseTimer = () => {
    setTimerRunning(false);
  };

  const handleResetTimer = () => {
    setElapsedTime(0);
  };
  if (isLoading) {
    return (
      <main className="page">
        <p>Loading room...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <h1>{error}</h1>
      </main>
    );
  }
  const handleClearWhiteboard = () => {
  const canvas = canvasRef.current;
  const context = contextRef.current;

  if (!canvas || !context) return;

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
};

const handleSaveWhiteboard = () => {
  const canvas = canvasRef.current;

  if (!canvas) return;

  const link = document.createElement("a");

  link.download = "whiteboard.png";
  link.href = canvas.toDataURL();

  link.click();
};

  return (
    <div className={darkMode ? "dark-theme" : "light-theme"}>
    
     <Navbar
       roomId={roomId}
       userCount={users.length}
       timer={formatTime(elapsedTime)}
       timerRunning={timerRunning}
       onStartTimer={handleStartTimer}
       onPauseTimer={handlePauseTimer}
       onResetTimer={handleResetTimer}
       onCopyRoomId={handleCopyRoomId}
       onLeaveRoom={handleLeaveRoom}
       themeToggle={
        <ThemeToggle
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
  }
      />
      <main className="page room-page">
        <RoomLayout
          usersPanel={
            <UsersPanel users={users} currentUsername={username} />
          }
          editorPanel={
            <div className="editor-section">
              <LanguageSelector
                language={language}
                setLanguage={setLanguage}
              />

              <RunButton handleRun={handleRun} />

              <EditorPanel
                code={code}
                handleCodeChange={handleCodeChange}
                editorRef={editorRef}
                monacoRef={monacoRef}
                socketRef={socketRef}
                roomId={roomId}
                username={username}
                darkMode={darkMode}
                language={language}
              />
            </div>
          }
          problemPanel={<ProblemPanel />}
          whiteboardPanel={
            <WhiteboardPanel
              canvasRef={canvasRef}
              width={1000}
              height={300}
              onClear={handleClearWhiteboard}
              onSave={handleSaveWhiteboard}
              brushColor={brushColor}
              setBrushColor={setBrushColor}
              brushSize={brushSize}
              setBrushSize={setBrushSize}
            />
          }
          outputPanel={
            <OutputPanel output={output} />
          }
        />
      </main>
    </div>
  );
}

export default Room;
