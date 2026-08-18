import requests

OLLAMA_URL = "http://127.0.0.1:11434"
MODEL = "qwen3-fast"
def chat(messages):
    response = requests.post(
        f"{OLLAMA_URL}/api/chat",
        json={
            "model": MODEL,
            "messages": messages,
            "stream": False,
        },
        timeout=300,
    )

    response.raise_for_status()

    return response.json()["message"]["content"]