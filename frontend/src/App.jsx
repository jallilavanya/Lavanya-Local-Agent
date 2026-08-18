import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const textareaRef = useRef(null);
  const chatRef = useRef(null);

  // ================================================
  // API CONFIGURATION
  // ================================================

  const API_URL = import.meta.env.VITE_API_URL;

  // ================================================
  // THEME
  // ================================================

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );

    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  // ================================================
  // AUTO SCROLL
  // ================================================

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  // ================================================
  // SEND MESSAGE
  // ================================================

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    // Clear input
    setMessage("");

    // Show loading
    setLoading(true);

    try {
      // Check API URL
      if (!API_URL) {
        throw new Error(
          "VITE_API_URL is not configured."
        );
      }

      const response = await fetch(
        `${API_URL}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status}`
        );
      }

      const data = await response.json();

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.response ||
            "The agent returned an empty response.",
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    }
  };

  // ================================================
  // KEYBOARD
  // ================================================

  const handleKeyDown = (event) => {
    // Enter = Send
    // Shift + Enter = New line

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  // ================================================
  // SUGGESTIONS
  // ================================================

  const useSuggestion = (text) => {
    setMessage(text);

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  // ================================================
  // NEW CHAT
  // ================================================

  const newChat = () => {
    setMessages([]);
    setMessage("");

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  // ================================================
  // UI
  // ================================================

  return (
    <div className="app">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="sidebar">

        {/* BRAND */}

        <div className="brand">

          <div className="brand-icon">
            L
          </div>

          <div>
            <div className="brand-name">
              Lavanya
            </div>

            <div className="brand-subtitle">
              AI AGENT
            </div>
          </div>

        </div>

        {/* NEW CHAT */}

        <button
          className="new-chat"
          onClick={newChat}
        >
          <span className="plus">
            ＋
          </span>

          New conversation
        </button>

        {/* MODEL */}

        <div className="sidebar-label">
          MODEL
        </div>

        <div className="model-card">

          <div className="model-icon">
            ◈
          </div>

          <div className="model-info">

            <div className="model-name">
              Qwen / Cloud LLM
            </div>

            <div className="model-version">
              AI Coding Model
            </div>

          </div>

          <span className="online-dot" />

        </div>

        {/* WORKSPACE */}

        <div className="sidebar-label workspace-label">
          WORKSPACE
        </div>

        <div className="workspace-card">

          <div className="folder-icon">
            ⌂
          </div>

          <div>

            <div className="workspace-name">
              Lavanya Agent
            </div>

            <div className="workspace-path">
              Cloud workspace
            </div>

          </div>

        </div>

        {/* SPACER */}

        <div className="sidebar-spacer" />

        {/* SYSTEM STATUS */}

        <div className="system-status">

          <div className="status-indicator">

            <span />

            AI service connected

          </div>

          <div className="system-details">

            <span>
              Cloud inference
            </span>

            <span>
              Online
            </span>

          </div>

        </div>

        {/* FOOTER */}

        <div className="sidebar-footer">

          <span>
            AI AGENT
          </span>

          <span>
            •
          </span>

          <span>
            CLOUD
          </span>

        </div>

      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="main">

        {/* HEADER */}

        <header className="header">

          {/* HEADER LEFT */}

          <div className="header-left">

            {/* MOBILE LOGO */}

            <div className="mobile-brand">
              L
            </div>

            <div>

              <h1>
                AI Coding Agent
              </h1>

              <div className="header-status">

                <span className="tiny-dot" />

                Online

              </div>

            </div>

          </div>

          {/* HEADER RIGHT */}

          <div className="header-right">

            {/* THEME BUTTON */}

            <button
              className="theme-toggle"
              onClick={() =>
                setDarkMode(
                  (previous) => !previous
                )
              }
              title={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              aria-label={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {darkMode ? "☀" : "☾"}
            </button>

            {/* MODEL */}

            <div className="model-pill">

              <span>
                ◈
              </span>

              AI Coding Model

            </div>

            {/* ONLINE STATUS */}

            <div className="local-pill">

              <span />

              Online

            </div>

          </div>

        </header>

        {/* =====================================================
            CHAT
        ===================================================== */}

        <div
          className="chat"
          ref={chatRef}
        >

          {/* =================================================
              WELCOME SCREEN
          ================================================= */}

          {messages.length === 0 ? (

            <div className="welcome">

              {/* ORB */}

              <div className="welcome-orb">

                <div className="orb-inner">
                  ✦
                </div>

              </div>

              {/* EYEBROW */}

              <div className="eyebrow">
                YOUR AI CODING AGENT
              </div>

              {/* TITLE */}

              <h2>
                Build something
                <span> great.</span>
              </h2>

              {/* DESCRIPTION */}

              <p className="welcome-description">
                Ask questions, write code, debug
                errors, or learn programming with
                your AI coding assistant.
              </p>

              {/* =================================================
                  SUGGESTIONS
              ================================================= */}

              <div className="suggestions">

                {/* WRITE CODE */}

                <button
                  onClick={() =>
                    useSuggestion(
                      "Write a Python function to reverse a linked list and explain it."
                    )
                  }
                >

                  <span className="suggestion-icon purple">
                    {"</>"}
                  </span>

                  <span>

                    <strong>
                      Write code
                    </strong>

                    <small>
                      Build a Python function
                    </small>

                  </span>

                  <span className="arrow">
                    →
                  </span>

                </button>

                {/* LEARN */}

                <button
                  onClick={() =>
                    useSuggestion(
                      "Explain React useState with a simple example."
                    )
                  }
                >

                  <span className="suggestion-icon blue">
                    ✦
                  </span>

                  <span>

                    <strong>
                      Learn
                    </strong>

                    <small>
                      Explain React concepts
                    </small>

                  </span>

                  <span className="arrow">
                    →
                  </span>

                </button>

                {/* DEBUG */}

                <button
                  onClick={() =>
                    useSuggestion(
                      "Find bugs in this code and explain how to fix them."
                    )
                  }
                >

                  <span className="suggestion-icon orange">
                    ⌘
                  </span>

                  <span>

                    <strong>
                      Debug
                    </strong>

                    <small>
                      Find and fix problems
                    </small>

                  </span>

                  <span className="arrow">
                    →
                  </span>

                </button>

              </div>

            </div>

          ) : (

            /* =================================================
               MESSAGES
            ================================================= */

            <div className="messages">

              {messages.map(
                (item, index) => (

                  <div
                    key={index}
                    className={`message-row ${item.role}`}
                  >

                    {/* AVATAR */}

                    <div
                      className={`avatar ${
                        item.role === "user"
                          ? "user-avatar"
                          : "ai-avatar"
                      }`}
                    >

                      {item.role === "user"
                        ? "Y"
                        : "L"}

                    </div>

                    {/* MESSAGE */}

                    <div className="message-body">

                      <div className="message-role">

                        {item.role === "user"
                          ? "You"
                          : "Lavanya Agent"}

                      </div>

                      <div className="message-content">
                        {item.content}
                      </div>

                    </div>

                  </div>

                )
              )}

              {/* THINKING INDICATOR */}

              {loading && (

                <div className="message-row assistant">

                  <div className="avatar ai-avatar">
                    L
                  </div>

                  <div className="message-body">

                    <div className="message-role">
                      Lavanya Agent
                    </div>

                    <div className="thinking">

                      <span />
                      <span />
                      <span />

                      <em>
                        Thinking...
                      </em>

                    </div>

                  </div>

                </div>

              )}

            </div>

          )}

        </div>

        {/* =====================================================
            COMPOSER
        ===================================================== */}

        <div className="composer-wrapper">

          <div className="composer">

            {/* TEXTAREA */}

            <textarea
              ref={textareaRef}
              value={message}
              onChange={(event) =>
                setMessage(
                  event.target.value
                )
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask your AI coding agent..."
              rows={1}
            />

            {/* COMPOSER BOTTOM */}

            <div className="composer-bottom">

              {/* HINTS */}

              <div className="composer-hints">

                <span>
                  ↵ Send
                </span>

                <span>
                  Shift + ↵ New line
                </span>

              </div>

              {/* SEND BUTTON */}

              <button
                className="send"
                onClick={sendMessage}
                disabled={
                  loading ||
                  !message.trim()
                }
                aria-label="Send message"
              >

                {loading
                  ? "..."
                  : "↑"}

              </button>

            </div>

          </div>

          {/* FOOTER */}

          <div className="footer">

            <span>
              Lavanya Agent
            </span>

            <span>
              ·
            </span>

            <span>
              Powered by Ollama Cloud
            </span>

            <span>
              ·
            </span>

            <span>
              Cloud AI
            </span>

          </div>

        </div>

      </main>

    </div>
  );
}

export default App;
