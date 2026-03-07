// Initialize map
const map = L.map('map').setView([43.47032, -80.54232], 16);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);




let playerMarker;


//constantly updates user's pos
navigator.geolocation.watchPosition(
    (position) => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const latlng = [lat, lon];

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

//draws circle
L.circle([43.47032, -80.54232], {
    radius: 20
}).addTo(map);