/*const image_input = document.querySelector("#image-input");

image_input.addEventListener("change",function(){
    const reader = new FileReader();

    reader.addEventListener("load", () =>{
        const uploaded_image = reader.result;
        const display_div = document.querySelector("#display-image");

        // 1. Set the background image
        display_div.style.backgroundImage = `url(${uploaded_image})`;
        
        // 2. Hide the "Click to Upload" text so it doesn't overlap the photo
        display_div.querySelector(".upload-text").style.display = "none";
        
        // 3. Remove the dashed border for a cleaner look
        display_div.style.borderStyle = "solid";
    });

    if(this.files && this.files[0]) {
        reader.readAsDataURL(this.files[0]);
    }
});*/
let playerId;
let gameId;
let centerLat;
let centerLon;




const rulesBtn = document.querySelector("#rulez");
const list_of_rules = document.querySelector("#list-of-rules");

rulesBtn.addEventListener("click", () => {
    list_of_rules.style.display = "flex";
});

window.addEventListener("click", (event) => {
    if (event.target == list_of_rules) {
        list_of_rules.style.display = "none";
    }
});

const joinBtn = document.querySelector("#join-game")
const join_pop_up = document.querySelector("#join-pop-up")
const close_pop_up = document.querySelector("#cancel")
const confirm_join = document.querySelector("#confirm-join")

const player_name = document.querySelector("#player-name")

const createBtn = document.querySelector("#create-game")

// Helper: get current position as a Promise
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true
        });
    });
}

//open pop-up
joinBtn.addEventListener("click", () => {
    if (player_name.value.trim() !== "") {
        join_pop_up.style.display = "flex";
    }
    else {
        alert("Enter your Name!");
        player_name.style.borderColor = "red";
    }
});

//close pop-up
close_pop_up.addEventListener("click", () => {
    join_pop_up.style.display = "none";
});

//close pop-up method 2
window.addEventListener("click", (event) => {
    if (event.target == join_pop_up) {
        join_pop_up.style.display = "none"
    }
});

//when confirm join is pressed
confirm_join.addEventListener("click", async () => {

    // Read the game ID from the input field
    const joinIdInput = document.querySelector("#join-id");
    gameId = joinIdInput.value.trim();

    if (!gameId) {
        alert("Enter a Game ID!");
        joinIdInput.style.borderColor = "red";
        return;
    }

    try {
        const position = await getPosition();
        centerLat = position.coords.latitude;
        centerLon = position.coords.longitude;
    } catch (err) {
        console.error('Failed to get location:', err);
        alert('Location access is required to join a game.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8000/api/join_game/${gameId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                player_name: player_name.value,
                lat: centerLat,
                lon: centerLon
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Join failed: ${response.status} ${errText}`);
        }

        const data = await response.json();
        playerId = data.player_id;
        gameId = data.game_id;

        // Store state so mapPage.js can read it
        sessionStorage.setItem("playerId", playerId);
        sessionStorage.setItem("gameId", gameId);
        sessionStorage.setItem("centerLat", centerLat);
        sessionStorage.setItem("centerLon", centerLon);

        window.location.href = `mapPage.html`;

    } catch (err) {
        console.error('Error joining game:', err);
        alert('Unable to join game. See console for details.');
    }
});

// CREATE GAME button — calls API then navigates
createBtn.addEventListener("click", async () => {
    if (player_name.value.trim() === "") {
        alert("Enter your Name!");
        player_name.style.borderColor = "red";
        return;
    }

    try {
        const position = await getPosition();
        centerLat = position.coords.latitude;
        centerLon = position.coords.longitude;
    } catch (err) {
        console.error('Failed to get location:', err);
        alert('Location access is required to create a game.');
        return;
    }

    try {
        const response = await fetch("http://localhost:8000/api/create_game", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                player_name: player_name.value,
                lat: centerLat,
                lon: centerLon,
                center_lat: centerLat,
                center_lon: centerLon
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Create failed: ${response.status} ${errText}`);
        }

        const data = await response.json();
        playerId = data.player_id;
        gameId = data.game_id;

        // Store state so mapPage.js can read it
        sessionStorage.setItem("playerId", playerId);
        sessionStorage.setItem("gameId", gameId);
        sessionStorage.setItem("centerLat", centerLat);
        sessionStorage.setItem("centerLon", centerLon);

        window.location.href = 'mapPage.html';

    } catch (err) {
        console.error('Error creating game:', err);
        alert('Unable to create game. See console for details.');
    }
});
