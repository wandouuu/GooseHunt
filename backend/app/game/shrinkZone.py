import math
import time

centerLat = 43.4703327
centerLong = -80.542324
radius=400
# pass radius output decreaseing radiuses as zone decreases that can be updated to front end every 3 seconds for gradient shrink
#shrinkzzones[19]= final zone initial zone is passed 
def shrink_zone(radius):
    change =radius * 0.25 
    radius = radius * 0.75
    shrinkZones=[radius +change*0.95, radius + change*0.9, radius + change*0.85, radius + change*0.8, radius + change*0.75, radius + change*0.7, radius + change*0.65, radius + change*0.6, radius + change*0.55, radius + change*0.5, radius + change*0.45, radius + change*0.4, radius + change*0.35, radius + change*0.3, radius + change*0.25, radius + change*0.2, radius + change*0.15, radius + change*0.1, radius + change*0.05, radius]
    return shrinkZones; 
    
shrink_zone(radius)