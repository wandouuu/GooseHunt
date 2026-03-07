from FastAPI import APIRouter, HTTPException
import app.game.game_manager as game_manager
router = APIRouter()

@router.post("/create_game")
async def create_game():
    game_id = game_manager.create_game()

    if game_id is None:
        raise HTTPException(status_code = 400, detail="Cannot create more than one game")
    return {"game_id": game_id}


@router.post("/join_game/{game_id}")
async def join_game(game_id: str):
    pass



