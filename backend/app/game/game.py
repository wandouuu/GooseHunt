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
        
        self.players = []
        self.game_started = False
        self.max_players = 200
        self.radius = 400
        self.current_radius = 400
        self.next_radius= 300
        self.zone_changing =False
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
                # role = 0 for seeker
                player.role = 0
            else:
                # role = 1 for hider
                player.role = 1
    def shrink_zone(self):
        self.radius = self.radius * 0.75
        self.next_radius = self.radius * 0.75


    def send_zone_changing(self):# evry 5 seconds send the next radius to the front end to update the zone
        if self.zone_changing==True:
            self.current_radius=self.current_radius-(self.radius-self.next_radius)/12 
            return self.current_radius
        else: 
            return self.radius
    

    def move_position_data(player):
        Player.lat[4]=Player.lat[3]
        Player.lon[4]=Player.lon[3]

        Player.lat[3]=Player.lat[2]
        Player.lon[3]=Player.lon[2]

        Player.lat[2]=Player.lat[1]
        Player.lon[2]=Player.lon[1]

        Player.lat[1]=Player.lat[0]
        Player.lon[1]=Player.lon[0]

        



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


                    



            
    
    


    