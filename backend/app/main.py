from fastapi import FastAPI
from app.api.websockets import game_websocket
from app.api.routes import router

app = FastAPI()
app.include_router(ws_router)
app.include_router(api_router)


