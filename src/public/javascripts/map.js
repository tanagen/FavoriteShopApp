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
let coordinate = null; // 座標情報を一時的に保存する変数

// フォーム送信時の処理
document.getElementById("show-button").addEventListener("click", () => {
  // event.preventDefault(); // フォームの通常の送信を防止

  // フォームデータを取得
  // const formData = new FormData(event.target);

  // フォームデータからメッセージを取得
  // const shopLocatino = formData.get("shop-name");
  const shopName = document.getElementById("name").value;

  // google mapを表示する関数を呼び出す
  displayMap(shopName);
});

function initMap() {
  let center;

  // hiddenタグの緯度経度情報を取得
  let latlng = document.getElementById("latlng").value;
  let latlngJSON = JSON.parse(latlng);

  // 地図の中心値
  center = new google.maps.LatLng(latlngJSON.lat, latlngJSON.lng);

  // 地図の中心の初期値
  // const tokyo = new google.maps.LatLng(35.6811673, 139.7670516);

  // infowindow = new google.maps.InfoWindow();
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
  google.maps.event.addListener(map, "click", (event) =>
    clickListener(event, map)
  );
}

function displayMap(location) {
  // 地図を表示するためのオプションを設定
  const mapOptions = {
    zoom: 15, //ズームレベル
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
    } else {
      // 地名が解決できなかった場合のエラーメッセージ
      alert("地名が見つかりませんでした。");
    }
  });

  // クリックでマーカーを立てるイベントリスナーを追加
  google.maps.event.addListener(map, "click", (event) =>
    clickListener(event, map)
  );
}

function clickListener(event, map) {
  console.log("call clickListener");
  // const latLng = event.latLng();
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

  // 地図の中心を地名の位置に指定;
  // let latlng = new google.maps.LatLng(lat, lng);
  // map.setCenter(latlng);

  // サーバーに座標情報を送信するためのAjaxリクエストを追加
  // sendCoordinateToServer(lat, lng);
}

// Ajaxリクエストをサーバーに送信
// function sendCoordinateToServer(lat, lng) {
//   const xhr = new XMLHttpRequest();
//   xhr.open("POST", "/list/saveCoordinate", true);
//   xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

//   // データをJSON形式で送信
//   const data = JSON.stringify({ lat, lng });
//   console.log(`data:${data}`);

//   xhr.onload = function () {
//     if (xhr.status === 200) {
//       console.log("座標情報がサーバーに送信されました。");
//     } else {
//       console.error("サーバーへのリクエストに失敗しました。");
//     }
//   };

//   xhr.send(data);
// }

window.initMap = initMap;
