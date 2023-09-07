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
let marker;
// フォーム送信時の処理
document.getElementById("shop-location").addEventListener("submit", (event) => {
    event.preventDefault(); // フォームの通常の送信を防止
    // フォームデータを取得
    const formData = new FormData(event.target);
    // フォームデータからメッセージを取得
    const shopLocation = formData.get("shop-name");
    // google mapを表示する関数を呼び出す
    displayMap(shopLocation);
});
function initMap() {
    // 地図の中心の初期値
    const tokyo = new google.maps.LatLng(35.6811673, 139.7670516);
    // infowindow = new google.maps.InfoWindow();
    map = new google.maps.Map(document.getElementById("map"), {
        center: tokyo,
        zoom: 15,
    });
    // クリックでマーカーを立てるイベントリスナーを追加
    google.maps.event.addListener(map, "click", (event) => clickListener(event, map));
    // const requestLocation = document.getElementById("map-request").innerHTML;
    // const request = {
    //   query: requestLocation,
    //   fields: ["name", "geometry"],
    // };
    // service = new google.maps.places.PlacesService(map);
    // service.findPlaceFromQuery(request, (results, status) => {
    //   if (status === google.maps.places.PlacesServiceStatus.OK && results) {
    //     for (let i = 0; i < results.length; i++) {
    //       createMarker(results[i]);
    //     }
    //     map.setCenter(results[0].geometry.location);
    //   }
    // });
}
// function createMarker(place) {
//   if (!place.geometry || !place.geometry.location) return;
//   const marker = new google.maps.Marker({
//     map,
//     position: place.geometry.location,
//   });
//   google.maps.event.addListener(marker, "click", () => {
//     infowindow.setContent(place.name || "");
//     infowindow.open(map);
//   });
// }
function displayMap(location) {
    // 地図を表示するためのオプションを設定
    const mapOptions = {
        zoom: 15,
        center: { lat: 0, lng: 0 }, //デフォルトの中心座標
    };
    // 地図を表示する要素を指定
    const mapElement = document.getElementById("map");
    // 地図のオブジェクトを作成
    map = new google.maps.Map(mapElement, mapOptions);
    // Google Geocoding APIを使用して地名を緯度経度に変換
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: location }, (results, status) => {
        if (status === "OK") {
            // 地名が正しく解決された場合、地図上にマーカーを表示
            const locationLatLng = results[0].geometry.location;
            new google.maps.Marker({
                position: locationLatLng,
                map: map,
                title: location,
            });
            // 地図の中心を地名の位置に指定
            map.setCenter(locationLatLng);
        }
        else {
            // 地名が解決できなかった場合のエラーメッセージ
            alert("地名が見つかりませんでした。");
        }
    });
}
function clickListener(event, map) {
    console.log("call clickListener");
    // const latLng = event.latLng();
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    console.log(lat);
    console.log(lng);
    // 既存マーカーを削除(1つのマーカーのみを表示したいため)
    if (marker) {
        marker.setMap(null);
    }
    marker = new google.maps.Marker({ position: { lat: lat, lng: lng } }, map);
    marker.setMap(map);
    // 地図の中心を地名の位置に指定;
    // map.setCenter(latLng);
}
window.initMap = initMap;
