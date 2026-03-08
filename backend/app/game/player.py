class Player:
    # role = 0 for seeker and 1 for hider
    def __init__(self, player_id, player_name, lat, lon):
        self.player_id = player_id
        self.name = player_name
        self.lat = [lat for i in range(5)]
        self.lon = [lon for i in range(5)]
        self.role = None
        self.websocket = None


