// const socket = new WebSocket();


// THIS NEEDS VARS:
// gameState = true for game still going, false for game over
// playerId
// gameId
//centerLat
// centerLon
//role



// Initialize map
const map = L.map('map').setView([43.47032, -80.54232], 16);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

   
//draws circle

// REPLACE WITH centerLat, centerLon
let circle = L.circle([43.47032, -80.54232], {
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
        // let now = Date.now();

        //no more than once a second, send new position through websocket
        // if(now - lastPosUpdate >= 1000){
        //     const data = {
        //         player_id: playerId,
        //         game_id: gameId,
        //         latitude: lat,
        //         longitude: lon
        //     };

        //     socket.send(JSON.stringify(data));

        //     lastPosUpdate = now;
        // }
    
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

// socket.onmessage = (event) => {
//     const data = JSON.parse(event.data);

//     if(data.type === "radius_update"){
//         circle.setRadius(data.radius);
//     }
//     else if(data.type === "role_update"){
//         document.getElementById("player-role").textContent = data.role;
//         if(data.role == "Seeker"){
//             document.getElementById("caught-btn").style.display = "none";
//         }
//     }

// }


document.getElementById("caught-btn").addEventListener("click", async () => {
    // try{
        // const response = await fetch("INSERT API ROUTE HERE", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": ""
        //     },
        //     body: JSON.stringify({
        //         player_id: playerId
        //     })
            
        // });
        document.getElementById("caught-btn").style.display = "none";
        
        // const data = await response.json();
        
    // }catch (error) {
    //     console.error("Error sending caught status:", error);
    // }
});