// Import Socket.IO client library
import { io } from "socket.io-client";  

const socket = io();  // Establish Socket.IO connection

// Geolocation handling
if (navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
}

// Initialize Leaflet map
const map = L.map("map").setView([0, 0], 10);

// Add tile layer to the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap"
}).addTo(map)

const markers = {}; 
socket.on("receive-location", (data)=>{
    const {id, latitude, longitude }= data;
    map.setView([latitude, longitude], 16);
    if(markers[id]) {
      markers[id].setLatLng([latitude, longitude]);
    }
    else{
        markers[id]= L.marker([latitude, longitude]).addTo(map);
        }
    }
)

