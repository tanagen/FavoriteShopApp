"use strict";
let map;
let marker;
let coordinate = null; // 座標情報を一時的に保存する変数
// フォーム送信時の処理
document.getElementById("show-button").addEventListener("click", () => {
    const shopName = document.getElementById("name").value;
    // google mapを表示する関数を呼び出す
    displayMap(shopName);
});
function initMap() {
    // hiddenタグの緯度経度情報を取得
    let latlng = document.getElementById("latlng").value;
    let latlngJSON = JSON.parse(latlng);
    // 地図の中心値
    let center = new google.maps.LatLng(latlngJSON.lat, latlngJSON.lng);
    // Mapクラスのインスタンス作成
    map = new google.maps.Map(document.getElementById("map"), {
        center: center,
        zoom: 15,
    });
    // Markerクラスのインスタンス作成
    marker = new google.maps.Marker({
        position: center,
        map: map,
    });
    // mapにmarkerをセット
    marker.setMap(map);
    // クリックでマーカーを立てるイベントリスナーを追加
    google.maps.event.addListener(map, "click", (event) => clickListener(event, map));
}
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
            let locationLatLng = results[0].geometry.location;
            marker = new google.maps.Marker({
                position: locationLatLng,
                map: map,
                title: location,
            });
            marker.setMap(map);
            // 地図の中心を地名の位置に指定
            map.setCenter(locationLatLng);
            // 緯度経度情報をhiddenタグに一時的に保存
            document.getElementById("latlng").value = JSON.stringify(locationLatLng);
        }
        else {
            // 地名が解決できなかった場合のエラーメッセージ
            alert("地名が見つかりませんでした。");
        }
    });
    // クリックでマーカーを立てるイベントリスナーを追加
    google.maps.event.addListener(map, "click", (event) => clickListener(event, map));
}
function clickListener(event, map) {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    coordinate = { lat: lat, lng: lng };
    // 緯度経度情報をhiddenタグに一時的に保存
    document.getElementById("latlng").value = JSON.stringify(coordinate);
    // 既存マーカーを削除(1つのマーカーのみを表示したいため)
    if (marker) {
        marker.setMap(null);
    }
    marker = new google.maps.Marker({ position: { lat: lat, lng: lng } }, map);
    marker.setMap(map);
}
window.initMap = initMap;
