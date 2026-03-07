import random
import string

class GameManager:
    def __init__(self):
        self.active_games = {}

    def create_game(self):
        if self.active_games:
            return None  # A game already exists

        game_id = "".join(random.choices(string.ascii_uppercase + string.digits, k=5))
        self.active_games[game_id] = Game(game_id)
        return game_id
    
    def get_game(self, game_id: str):
        return self.active_games.get(game_id)

    def remove_game(self, game_id: str):
        if game_id in self.active_games:
            del self.active_games[game_id]