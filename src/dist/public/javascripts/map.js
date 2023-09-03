"use strict";
// Google Mapsの初期化
// async function initMap() {
//   const { Map } = await google.maps.importLibrary("maps");
//   let map = new Map(document.getElementById("map"), {
//     center: { lat: 35.6811673, lng: 139.7670516 },
//     zoom: 15,
//     mapTypeId: "roadmap",
//   });
// }
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
let map;
let service;
let infowindow;
function initMap() {
    const sydney = new google.maps.LatLng(35.6811673, 139.7670516);
    infowindow = new google.maps.InfoWindow();
    map = new google.maps.Map(document.getElementById("map"), {
        center: sydney,
        zoom: 15,
    });
    const requestLocation = document.getElementById("map-request").innerHTML;
    const request = {
        query: requestLocation,
        fields: ["name", "geometry"],
    };
    service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            for (let i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
            map.setCenter(results[0].geometry.location);
        }
    });
}
function createMarker(place) {
    if (!place.geometry || !place.geometry.location)
        return;
    const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
    });
    google.maps.event.addListener(marker, "click", () => {
        infowindow.setContent(place.name || "");
        infowindow.open(map);
    });
}
window.initMap = initMap;
