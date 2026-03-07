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
        
        self.players = {}
        self.game_started = False
        self.max_players = 200
        self.radius = 400
        player = Player(player_id, player_name, center_lat, center_lon)
        self.add_player(player)
        

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

    def shrink_zone(radius):
        change =radius * 0.25 
        radius = radius * 0.75
        shrinkZones=[radius +change*0.95, radius + change*0.9, radius + change*0.85, radius + change*0.8, radius + change*0.75, radius + change*0.7, radius + change*0.65, radius + change*0.6, radius + change*0.55, radius + change*0.5, radius + change*0.45, radius + change*0.4, radius + change*0.35, radius + change*0.3, radius + change*0.25, radius + change*0.2, radius + change*0.15, radius + change*0.1, radius + change*0.05, radius]
        return shrinkZones; 

    def move_position_data(self, player):
        for i in range(4, 0, -1):
            player.lat[i] = player.lat[i - 1]
            player.lon[i] = player.lon[i - 1]

        



    def start_game(self):
        assert(self.num_players > 1)
        self.assign_roles()
        total_hiders=0
        for player in self.players:
            total_hiders += player.role

        time_shrink= 360 # 6 minutes until shrink starts
        while (total_hiders > 1):
            shrink = self.shrink_zone(self.radius)
            
            closing_circle_radius = shrink[19]
            for i in range(360):
                for player in self.players:
                    self.move_position_data(player)
                #message()
                
                for player in self.players:
                    if player.role == 1:

                        Out_of_zone_count=0 #counter to track how many times a player is outside the zone, if they are outside the zone for 5 seconds straight they are eliminated
                        for i in range(5):
                            if spatial_logic.is_outside_boundary(player.lat[i], player.lon[i], self.center_lat, self.center_lon,self.radius):
                                Out_of_zone_count += 1
                            else: break
                        if (Out_of_zone_count == 5):
                            player.role = 0
                            total_hiders -= 1
                

        # game ends send messege to winner and game over screen to seekers


                    



            
    
    


    