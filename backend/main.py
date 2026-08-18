import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ollama_client import chat


app = FastAPI(title="Lavanya Local Coding Agent")


# --------------------------------------------------
# CORS
# --------------------------------------------------

# Local frontend

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# Request model
# --------------------------------------------------

class ChatRequest(BaseModel):
    message: str


# --------------------------------------------------
# Root endpoint
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "name": "Lavanya Local Coding Agent",
        "status": "running",
        "model": os.getenv(
            "OLLAMA_MODEL",
            "qwen3-fast",
        ),
    }


# --------------------------------------------------
# Chat endpoint
# --------------------------------------------------

@app.post("/chat")
def chat_endpoint(request: ChatRequest):

    messages = [
        {
            "role": "system",
            "content": (
                "You are a coding assistant. "
                "Help the user write, understand, debug, "
                "and improve code. "
                "Give clear and accurate explanations."
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
