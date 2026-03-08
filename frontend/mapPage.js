// Read IDs from sessionStorage (set by Lobby.js)
const GameId = sessionStorage.getItem("GameId");
const PlayerId = sessionStorage.getItem("PlayerId");

const socket = new WebSocket(`ws://localhost:8000/ws/game/${GameId}/${PlayerId}`);

let circle;



// Initialize map
const map = L.map('map').setView([43.47032, -80.54232], 16);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Check if game already started (redirected from Lobby)
const gameStartData = sessionStorage.getItem("gameStartData");
if (gameStartData) {
    const startData = JSON.parse(gameStartData);
    circle = L.circle([startData.center_lat, startData.center_lon], {
        radius: startData.radius
    }).addTo(map);
    document.getElementById("player-role").innerText = startData.roles[PlayerId] === 0 ? "Seeker" : "Hider";
    document.getElementById("start-game-btn").style.display = "none";
    sessionStorage.removeItem("gameStartData");
}

//draws circle



// UI
// if(role == "Seeker"){
//     document.getElementById("caught-btn").style.display = "none";
// }



function updateTimer(seconds) {
    let minutes = Math.floor(seconds / 60);
    seconds = seconds - (minutes * 60);
    if (seconds < 10) {
        document.getElementById("timer").textContent = "Time Left: " + minutes + ":0" + seconds;
    }
    else {
        document.getElementById("timer").textContent = "Time Left: " + minutes + ":" + seconds;
    }
}

let timeLeft = 20;


setInterval(() => {
    if (timeLeft > 0) {
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
        if (now - lastPosUpdate >= 1000) {

            const data = {
                query: "update_location",
                lat: lat,
                lon: lon
            };

            socket.send(JSON.stringify(data));

            lastPosUpdate = now;
        }

        if (!playerMarker) {
            playerMarker = L.marker(latlng);
            playerMarker.addTo(map);
            map.setView(latlng, 24);
        }
        else {
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

    if (data.query === "zone_changing") {
        circle.setRadius(data.next_radius);
    } else if (data.query === "game_state") {
        if (data.game_state === "game_over") {

        } else {

        }
    } else if (data.query === "game_started") {
        circle = L.circle([data.center_lat, data.center_lon], {
            radius: data.radius
        }).addTo(map);
        document.getElementById("player-role").innerText = data.roles[PlayerId] === 0 ? "Seeker" : "Hider";
        document.getElementById("start-game-btn").style.display = "none";
    }
}


// Start Game button — sends start_game query via WebSocket
document.getElementById("start-game-btn").addEventListener("click", () => {
    socket.send(JSON.stringify({ query: "start_game" }));
});

document.getElementById("caught-btn").addEventListener("click", async () => {
    try {
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

    } catch (error) {
        console.error("Error sending caught status:", error);
    }
});

