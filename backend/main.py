from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ollama_client import chat


app = FastAPI(title="Lavanya Local Coding Agent")


# Allow the React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


@app.get("/")
def root():
    return {
        "name": "Lavanya Local Coding Agent",
        "status": "running",
        "model": "qwen2.5-coder:7b",
    }


@app.post("/chat")
def chat_endpoint(request: ChatRequest):
    messages = [
        {
            "role": "system",
            "content": (
                "You are a local coding assistant. "
                "Help the user write, understand, debug, and improve code."
            ),
        },
        {
            "role": "user",
            "content": request.message,
        },
    ]

    answer = chat(messages)

    return {
        "response": answer,
    }