# Lavanya Local Agent

> A personal local AI coding assistant built with React, FastAPI, and Ollama, powered by Qwen2.5-Coder.

Lavanya Local Agent is a full-stack AI coding assistant that runs locally on your machine. It provides a modern chat interface for asking programming questions, generating code, debugging errors, and learning software development concepts without requiring an external AI API key.

The project combines a React frontend with a FastAPI backend and Ollama for running the local large language model.

---

## ✨ Features

- 🤖 Local AI coding assistant
- 🧠 Powered by Qwen2.5-Coder
- ⚡ FastAPI backend
- ⚛️ Modern React frontend
- 🌓 Dark / Light mode
- 💬 Conversational chat interface
- 🧑‍💻 Code generation
- 🐛 Debugging assistance
- 📚 Programming concept explanations
- 💡 Quick suggestion prompts
- 🔄 Automatic chat scrolling
- ⌨️ Enter to send messages
- 📝 Shift + Enter for new lines
- 🟢 Ollama connection status
- 🔐 No external API key required
- 💻 Runs locally on your machine

---

## 🏗️ Architecture

```text
                    ┌─────────────────────────┐
                    │      User Browser       │
                    │                         │
                    │      React Frontend     │
                    │       Vite + CSS        │
                    └────────────┬────────────┘
                                 │
                                 │ HTTP POST
                                 │ /chat
                                 ▼
                    ┌─────────────────────────┐
                    │      FastAPI Backend    │
                    │                         │
                    │       Python API        │
                    └────────────┬────────────┘
                                 │
                                 │ Ollama API
                                 ▼
                    ┌─────────────────────────┐
                    │         Ollama          │
                    │                         │
                    │    Qwen2.5-Coder        │
                    │                         │
                    │      Local LLM          │
                    └─────────────────────────┘
