# GooseHunt
GooseHunt!


# Intro:
Goose Hunt is a University of Waterloo–focused game designed to give students a fun way to meet each other through a campus‑wide challenge. Players join through the website and are assigned the role of either the savage 
Goose or innocent Student. The students run and hide around campus while people assigned the role of Geese search for them, and the playable zone shrinks every five minutes. When a Goose tags a Student, that Student 
becomes a Goose and joins the chase. The game continues until only one Student remains, who is then crowned the winner. A final detail is that Students will have to wear a headband in order to be recognized by the geese. 
This game is a software that will keep track of players and zone changes for game-play to be implemented. Additionally, this Software would be aimed to be used during O-week as a fun icebreaker and students participating 
will be required to stick with the people they catch via proximity sensing with location tracking.

# Problem Being Solved:
Goose Hunt addresses the need for more engaging social events at UW, especially at the beginning of the year when new students are eager to meet people. O‑Week currently offers a series of structured, schedule‑driven 
events, but these don’t always create meaningful one‑on‑one interactions and often include only a limited selection of active activities. Goose Hunt helps solve this by giving students an energetic, slightly competitive 
way to get to know each other in a relaxed environment. Because Students can explore campus freely during the game, they’re more likely to interact naturally with others without the pressure of formal programming.

# Technologies Used:
This game is developed using a Python backend base and a HTML, CSS, JavaScript frontend. additionally, we use the HTML5 geolocation api for location, leaflet api for displaying the map, and FastAPI for messaging between frontend and backend. 

# Key Features:
- frontend interactive GUI
- location tracking of multiple users:
- game logic testing if players are outside of shrinking zone
- game timer prompting zone shrinks
- assigning player roles and player role management
- winner end screen
- interdevice connection

# Instructions :
The core device hosts the game by running the HTML/JS app on a local web server.
Other players connect to the same campus network (eduroam) and open the game webpage to join.
The game creator (host) starts the session; roles are automatically assigned to each player: Geese hunt, Students hide.
When a Goose tags a Student, the Student taps a “Switch to Goose” button to change teams and continue hunting.
(For the two‑player demo, the game ends immediately when the Student is tagged.)
The play zone automatically shrinks at set intervals, increasing intensity as the session progresses.
The game continues until all Students are caught; the last Student standing is declared the winner.

# Citations:

HTML5 geolocator API: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/geolocation: built into HTML : used for locating players

FASTAPI: https://fastapi.tiangolo.com/ : FastAPI : used for backend-frontend messaging

Leaflet API: https://leafletjs.com/ : Leaflet : used to display map player location and zone

Claude : https://claude.com/ : Anthropic : used for bug finding,  and API setup modifications on front end

GPT-4: https://chatgpt.com/ : OpenAI : UI overview on map reaserch

Copilot : https://copilot.microsoft.com/ : Microsoft : used for reaserch and inspiration for backend code as well as perfecting documentation making it more concise

Gemini: https://gemini.google.com/app : Google : used for front-end to help with CSS, JS and image generation

CanvaAI: https://www.canva.com/ai-assistant/ : Canva : used for styling presentation.
