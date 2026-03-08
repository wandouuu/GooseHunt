const socket = new WebSocket(`ws://localhost:8000/ws/game/${GameId}/${PlayerId}`);


// THIS NEEDS VARS:
// gameState = true for game still going, false for game over

let role;


// Initialize map
const map = L.map('map').setView([43.47032, -80.54232], 16);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

   
//draws circle

// REPLACE WITH centerLat, centerLon
let circle = L.circle([centerLat, centerLon], {
radius: 400
}).addTo(map);

// UI
// if(role == "Seeker"){
//     document.getElementById("caught-btn").style.display = "none";
// }



function updateTimer(seconds){
    let minutes = Math.floor(seconds / 60);
    seconds = seconds - (minutes * 60);
    if(seconds < 10){
        document.getElementById("timer").textContent = "Time Left: " + minutes + ":0" + seconds;    
    }
    else{
        document.getElementById("timer").textContent = "Time Left: " + minutes + ":" + seconds;
    }
}

//set to the amount of time for a game in seconds, will update every second
let timeLeft = 20;


setInterval(() => {
    if(timeLeft > 0){
        timeLeft--;
        updateTimer(timeLeft);
    }
}, 1000);




let playerMarker;
let lastPosUpdate = 0;

//constantly updates user's pos
navigator.geolocation.watchPosition(
    (position) => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const latlng = [lat, lon];
        let now = Date.now();

        // no more than once a second, send new position through websocket
        if(now - lastPosUpdate >= 1000){
            
            const data = {
                query: "update_location",
                lat: lat,
                lon: lon
            };

            socket.send(JSON.stringify(data));

            lastPosUpdate = now;
        }
    
        if(!playerMarker) {
            playerMarker = L.marker(latlng);
            playerMarker.addTo(map);
            map.setView(latlng, 24);
        }
        else{
            playerMarker.setLatLng(latlng);
        }
    },
    (error) => {
        console.error("Location error: ", error);
    },
    {
        enableHighAccuracy: true
    }
);


// until the game ends
let lastRadUpdate = 0;

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if(data.query === "radius_update"){
        circle.setRadius(data.radius);
    }
    else if(data.query === "role_update"){
        document.getElementById("player-role").textContent = data.role;
        if(data.query == "Seeker"){
            document.getElementById("caught-btn").style.display = "none";
        }
    }

}


document.getElementById("caught-btn").addEventListener("click", async () => {
    try{
        const response = await fetch(`http://localhost:8000/game_state/caught?game_id=${GameId}&player_id=${PlayerId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Caught response:", data);
        
        document.getElementById("caught-btn").style.display = "none";
        
    }catch (error) {
        console.error("Error sending caught status:", error);
    }

    
});