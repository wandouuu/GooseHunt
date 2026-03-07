from FastAPI import APIRouter, HTTPException
import app.game.game_manager as game_manager
from pydantic import BaseModel

router = APIRouter(prefix="/api")

class PlayerRequest(BaseModel):
    player_id: str
    
@router.post("/create_game")
async def create_game():
    game_id = game_manager.create_game()

    if game_id is None:
        raise HTTPException(status_code = 400, detail="Cannot create more than one game")
    return {"game_id": game_id}


@router.post("/join_game/{game_id}")
async def join_game(game_id: str):
    if game_id in game_manager.active_games:
        game_manager.active_games[game_id].join_game()
    else:
        raise HTTPException(status_code = 404, detail="Game not found")

@router.post("/leave_game/{game_id}")
async def leave_game(game_id: str):
    if game_id in game_manager.active_games:
        game_manager.active_games[game_id].leave_game()
    else:
        raise HTTPException(status_code = 404, detail="Game not found")