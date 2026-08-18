import os
import requests


# Local development:
# http://127.0.0.1:11434
#
# Production:
# Set these environment variables on Render:
# OLLAMA_URL
# OLLAMA_MODEL
# OLLAMA_API_KEY

OLLAMA_URL = os.getenv(
    "OLLAMA_URL",
    "http://127.0.0.1:11434",
)

MODEL = os.getenv(
    "OLLAMA_MODEL",
    "qwen3-fast",
)

OLLAMA_API_KEY = os.getenv("OLLAMA_API_KEY")


def chat(messages):
    headers = {}

    # Add authentication when using Ollama Cloud
    if OLLAMA_API_KEY:
        headers["Authorization"] = f"Bearer {OLLAMA_API_KEY}"

    response = requests.post(
        f"{OLLAMA_URL}/api/chat",
        headers=headers,
        json={
            "model": MODEL,
            "messages": messages,
            "stream": False,
        },
        timeout=300,
    )

    response.raise_for_status()

    return response.json()["message"]["content"]
