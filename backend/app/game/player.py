class Player:
    # role = 0 for hider and 1 for seeker
    def __init__(self, player_id, player_name, lat, lon):
        self.player_id = player_id
        self.name = player_name
        self.lat = lat
        self.lon = lon
        self.role = None
