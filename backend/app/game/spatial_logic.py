import math

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    # Calculates the distance between two points on the Earth using the Haversine formula
    EARTH_RADIUS = 6371.01  # Earth's radius in kilometers

    # requires difference between lat and lon in radians
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)

    # calculate the Haversine distance
    a = math.sin(delta_lat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(delta_lon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = EARTH_RADIUS * c
    return distance

def is_outside_boundary(player_lat: float, player_lon: float, center_lat: float, center_lon: float, radius_meters: float) -> bool:
    
