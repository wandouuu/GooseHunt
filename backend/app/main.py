from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.websockets import router as ws_router
from app.api.routes import router as api_router

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
app.include_router(ws_router)
app.include_router(api_router)
