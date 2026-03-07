from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.game.game_manager import game_manager

router = APIRouter(prefix = "/ws")

@router.get("/game/{game_id}/{player_id}")
async def game_websocket(websocket: WebSocket, game_id: str, player_id: str):

    await websocket.accept()

    game = game_manager.get(game_id)

    if not game:
        await websocket.close(code=4004, reason="Game not found")
        return

    if player_id not in game.players:
        await websocket.close(code=4001, reason="Player not in game")
        return

    game.connect(player_id, websocket)

    try:
        while True:
            data = await websocket.receive_json()

            match data["query"]:
                case "update_location":
                    pass
                case "start_game":
                    pass
    
    except WebSocketDisconnect:
        game.disconnect(player_id)