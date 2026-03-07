import math

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    # Calculates the distance between two points on the Earth using the Haversine formula
    
    # requires difference between lat and lon in radians
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)

    # calculate the Haversine distance
    
    