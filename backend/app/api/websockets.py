from fastapi import FastAPI, WebSocket

app = FastAPI()

@app.get("/")
async def get():
    return HTMLResponse(html)

@app.websocket("/location/update_position/{user_id}")
async def update_position(websocket: WebSocket):
    