
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import AsyncGenerator
import json
from chatbot import initializeAgent

app = FastAPI()

# Initialize the agent when the server starts
agent, config = await initializeAgent()

class ChatRequest(BaseModel):
    message: str

async def stream_chat_response(message: str) -> AsyncGenerator[str, None]:
    try:
        stream = await agent.stream(
            { messages: [new HumanMessage(message)] },
            config
        )

        for chunk in stream:
            if "agent" in chunk:
                yield json.dumps({"type": "agent", "content": chunk.agent.messages[0].content}) + "\n"
            elif "tools" in chunk:
                yield json.dumps({"type": "tools", "content": chunk.tools.messages[0].content}) + "\n"

    except Exception as e:
        yield json.dumps({"type": "error", "content": str(e)}) + "\n"

@app.post("/chat")
async def chat_endpoint(chat_request: ChatRequest):
    return StreamingResponse(
        stream_chat_response(chat_request.message),
        media_type="text/event-stream"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
