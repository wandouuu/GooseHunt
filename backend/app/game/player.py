class Player:
    # role = 0 for hider and 1 for seeker
    def __init__(self, id, name, lat, lon):
        self.id = id
        self.name = name
        self.lat = [lat,0,0,0,0]
        self.lon = [lon,0,0,0,0]
        self.role = None
