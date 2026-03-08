// Read state from sessionStorage (set by Lobby.js)
const PlayerId = sessionStorage.getItem("playerId");
const GameId = sessionStorage.getItem("gameId");
const centerLat = parseFloat(sessionStorage.getItem("centerLat"));
const centerLon = parseFloat(sessionStorage.getItem("centerLon"));

// Display the game ID on the UI
document.getElementById("game-id").textContent = GameId;

const socket = new WebSocket(`ws://localhost:8000/ws/game/${GameId}/${PlayerId}`);

let hidersRemaining = 0;



// Initialize map
const map = L.map('map').setView([43.47032, -80.54232], 16);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);





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

//set to the amount of time for a game in seconds, will update every second
let timeLeft = 0;
let timerInterval = null;

function startTimer(seconds) {
    timeLeft = seconds;
    updateTimer(timeLeft);
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimer(timeLeft);
        }
    }, 1000);
}




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


socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.query === "zone_changing") {
        circle.setRadius(data.next_radius);
    } else if (data.query === "game_state") {
        if (data.game_state === "game_over") {
            hidersRemaining--;
            document.getElementById("hider-count").textContent = hidersRemaining;
            window.location.href = "GameOver.html";
        }
    } else if (data.query === "game_started") {
        circle = L.circle([data.center_lat, data.center_lon], {
            radius: data.radius
        }).addTo(map);

        // Set role display
        const myRole = data.roles[PlayerId];
        document.getElementById("player-role").innerText = myRole === 0 ? "Seeker" : "Hider";

        // Count and display hiders
        hidersRemaining = Object.values(data.roles).filter(r => r === 1).length;
        document.getElementById("hider-count").textContent = hidersRemaining;

        // Hide caught button for seekers (seekers can't be caught)
        if (myRole === 0) {
            document.getElementById("caught-btn").style.display = "none";
        }

        document.getElementById("start-game-btn").style.display = "none";
        startTimer(360); // 6 minutes
    }
}


// Start Game button — sends start_game query via WebSocket
document.getElementById("start-game-btn").addEventListener("click", () => {
    socket.send(JSON.stringify({ query: "start_game" }));
});

// POST /api/game_state/caught/{game_id}/{player_id}
document.getElementById("caught-btn").addEventListener("click", async () => {
    try {
        const response = await fetch(`http://localhost:8000/api/game_state/caught/${GameId}/${PlayerId}`, {
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
