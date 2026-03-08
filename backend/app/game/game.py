import random
import math
from app.game.player import Player
import time
import asyncio
from app.game.spatial_logic import is_outside_boundary
import threading

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
        self.zone_timer= "6:00"
        

    def add_player(self, player_id, player_name, lat, lon):
        if(( not self.game_started) and (len(self.players) < self.max_players)):
            player = Player(player_id, player_name, lat, lon)
            self.players[player_id] = player
    
    def assign_roles(self):
        num_seekers = max(1, math.ceil(0.1 * len(self.players)))
        
        seekers = random.sample(list(self.players.keys()), num_seekers)

        for player_id in self.players:
            if player_id in seekers:
                # role = 0 for seeker
                self.players[player_id].role = 0
            else:
                # role = 1 for hider
                self.players[player_id].role = 1

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

    async def update_location(self, player_id, lat, lon):
        self.update_position(player_id, lat, lon)
        player = self.players[player_id]

        # Check if all 5 recent positions are outside boundary
        counter = 0
        for i in range(5):
            if is_outside_boundary(player.lat[i], player.lon[i], self.center_lat, self.center_lon, self.radius):
                counter += 1

        if counter == 5:
            await self.broadcast({"query": "game_state", "game_state": "game_over", "player_caught": player.name})

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

        self.start_timer()

    def start_timer(self):
        self._loop = asyncio.get_event_loop()
        thread = threading.Thread(target=self.timer, daemon=True)
        thread.start()

    def timer(self):
        init_time = time.monotonic()
        zone_change_time= 60
        multiplier = 1

        while True:
            time.sleep(1)
            elapsed_time = time.monotonic() - init_time
            time_left = zone_change_time - elapsed_time
            time_left = int(time_left)
            
            if time_left % 5 == 0:
                asyncio.run_coroutine_threadsafe(
                    self.broadcast({"query": "zone_changing", "next_radius": self.send_zone_changing()}),
                    self._loop
                ).result()
            
            self.update_time(time_left)

            if time_left <= 0:
                multiplier += 1
                self.zone_changing = True
                time_left= 60

                while time_left > 0:

                    time.sleep(1)
                    self.update_time(time_left+0)

                    if time_left % 5 == 0:
                        asyncio.run_coroutine_threadsafe(
                            self.broadcast({"query": "zone_changing", "next_radius": self.send_zone_changing()}),
                            self._loop
                        ).result()
                    time_left -= 1

                self.zone_changing = False
                time_left= 0
                zone_change_time*= multiplier
                init_time = time.monotonic()

                self.shrink_zone()

    def update_time(self, seconds):
        minutes = seconds // 60
        secs = seconds % 60
        self.zone_timer = f"{minutes}:{secs:02d}"
