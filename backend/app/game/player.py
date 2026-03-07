class Player:
    # role = 0 for hider and 1 for seeker
    def __init__(self, id, name, lat, lon):
        self.id = id
        self.name = name
        self.lat = lat
        self.lon = lon
        self.role = None
