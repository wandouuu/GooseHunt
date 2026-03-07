import random
import math
from player import Player



class Game:
    def __init__(self, game_id, center_lat, center_lon, player_id, player_name):
        self.game_id = game_id
        self.center_lat = center_lat
        self.center_lon = center_lon
        
        self.players = []
        self.game_started = False
        self.max_players = 200
        self.radius = 1000
        player = Player(player_id, player_name, center_lat, center_lon)
        self.add_player(player)
        

    def add_player(self, id, name, lat, lon):
        if(( not self.game_started) and (self.players.len() < self.max_players)):
            player = Player(id, name, lat, lon)
            self.players.append(player)
    
    def assign_roles(self):
        num_seekers = max(1, math.ceil(0.1 * self.players.len()))
        
        seekers = random.sample(self.players, num_seekers)

        for player in self.players:
            if player in seekers:
                # role = 1 for seeker
                player.role = 1
            else:
                # role = 0 for hider
                player.role = 0

    def start_game(self):
        assert(self.num_players > 1)
        self.assign_roles()
    


    