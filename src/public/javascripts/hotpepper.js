const shopName = "ラーメン";
const shopLat = JSON.parse(document.getElementById("latlng").value).lat;
const shopLng = JSON.parse(document.getElementById("latlng").value).lng;
// ある地点からの範囲内のお店を検索するクエリ
const params = new URLSearchParams({
  lat: JSON.parse(document.getElementById("latlng").value).lat,
  lng: JSON.parse(document.getElementById("latlng").value).lng,
  range: "2", // 1: 300m, 2: 500m, 3: 1000m (初期値), 4: 2000m, 5: 3000m
  keyword: "ラーメン",
});
const requestURL =
  hotpepperURL +
  "&lat=" +
  shopLat +
  "&lng=" +
  shopLng +
  "&range=" +
  "2" + // 1: 300m, 2: 500m, 3: 1000m (初期値), 4: 2000m, 5: 3000m
  "&keyword=" +
  shopName;

document.getElementById("search-button").addEventListener("click", () => {
  console.log(requestURL);
  hoppepperSearch(requestURL);
});

async function hoppepperSearch(url = "") {
  await fetch(url)
    .then((res) => {
      // サーバーエラーの場合
      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }
      // 成功時の処理
      const data = res.json();
      console.log(data);
    })
    .catch((error) => {
      console.log("エラーが発生しました", error);
    });
}
