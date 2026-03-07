from FastAPI import APIRouter, HTTPException
import app.game.game_manager as game_manager
from pydantic import BaseModel
import uuid

router = APIRouter(prefix="/api")

class PlayerRequest(BaseModel):
    player_name: str
    lat: float
    lon: float

class GameRequest(PlayerRequest):
    center_lat: float
    center_lon: float


@router.post("/create_game")
async def create_game(request: GameRequest):
    if request.player_name is None:
        raise HTTPException(status_code=400, detail="Player name is required")
    
    player_id = str(uuid.uuid4())

    game_id = game_manager.create_game(player_id=player_id,
                                       player_name=request.player_name,
                                       center_lat=request.center_lat,
                                       center_lon=request.center_lon)
    
    # Validate if game_manager already has one ongoing game
    if game_id is None:
        raise HTTPException(status_code=400, detail="Cannot create more than one game")

    # returns game_id and player_id
    return {"game_id": game_id, "player_id": player_id}


@router.post("/join_game/{game_id}")
async def join_game(game_id: str, request: PlayerRequest):
    if game_id in game_manager.active_games:
        player_id = str(uuid.uuid4())
        game_manager.active_games[game_id].add_player(player_id=player_id,
                                                      player_name=request.player_name,
                                                      lat=request.lat,
                                                      lon=request.lon)
        # returns player_id
        return {"player_id": player_id}
    else:
        raise HTTPException(status_code=404, detail="Game not found")

@router.post("/leave_game/{game_id}/{player_id}")
async def leave_game(game_id: str, player_id: str):
    if game_id in game_manager.active_games:
        game_manager.active_games[game_id].remove_player(player_id=player_id)
        return {"status": "left"}
    else:
        raise HTTPException(status_code=404, detail="Game not found")