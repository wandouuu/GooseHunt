import random
import math
from player import Player
import time 
import spatial_logic

class Game:
    def __init__(self, game_id, center_lat, center_lon, player_id, player_name):
        self.game_id = game_id
        self.center_lat = center_lat
        self.center_lon = center_lon
        self.players = {player_id: Player(player_id, player_name, center_lat, center_lon)}
        self.game_started = False
        self.max_players = 200
        self.radius = 400
        self.current_radius = 400
        self.next_radius= 300
        self.zone_changing =False
        

    def add_player(self, player_id, player_name, lat, lon):
        if(( not self.game_started) and (self.players.len() < self.max_players)):
            player = Player(id, name, lat, lon)
            self.players.append(player)
    
    def assign_roles(self):
        num_seekers = max(1, math.ceil(0.1 * self.players.len()))
        
        seekers = random.sample(self.players, num_seekers)

        for player in self.players:
            if player in seekers:
                # role = 0 for seeker
                player.role = 0
            else:
                # role = 1 for hider
                player.role = 1

    def shrink_zone(self):
        self.radius = self.radius * 0.75
        self.next_radius = self.radius * 0.75


    def send_zone_changing(self):# evry 5 seconds send the next radius to the front end to update the zone
        if self.zone_changing:
            self.current_radius = self.current_radius-(self.radius-self.next_radius)/12 
            return self.current_radius
        
        return self.radius
    

    def connect(self, player_id, websocket):
        # attribute to each player their own websocket for broadcast
        self.players[player_id].websocket = websocket
    
    def disconnect(self, player_id):
        # remove for each player their own websocket for broadcast
        self.players[player_id].websocket = None

    def update_position(self, player_id, lat, lon):
        player = self.players[player_id]

        for i in range(4, 0, -1):
            player.lat[i] = player.lat[i - 1]
            player.lon[i] = player.lon[i - 1]


        player.lat[0] = lat
        player.lon[0] = lon

    async def broadcast(self, message: dict):
        # For each player broadcast to everyone
        for player in self.players.values():
            # Send a WebSocket
            if player.websocket:
                await player.websocket.send_json(message)

    async def send_to_player(self, player_id, message: dict):
        # Send only to the player with specific player_id
        player = self.players[player_id]
        if player.websocket:
            await player.websocket.send_json(message)

    async def start_game(self):
        
        if len(self.players) < 2:
            return
        
        self.game_started = True

        self.assign_roles()

        await self.broadcast({"query": "game_started",
                              "center_lat": self.center_lat,
                              "center_lon": self.center_lon,
                              "radius": self.radius,
                              "roles": {pid: p.role for pid, p in self.players.items()}})


                    



            
    
    


    