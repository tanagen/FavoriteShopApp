"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const shopName = "ラーメン";
const shopLat = JSON.parse(document.getElementById("latlng").value).lat;
const shopLng = JSON.parse(document.getElementById("latlng").value).lng;
// ある地点からの範囲内のお店を検索するクエリ
const params = new URLSearchParams({
    lat: JSON.parse(document.getElementById("latlng").value).lat,
    lng: JSON.parse(document.getElementById("latlng").value).lng,
    range: "2",
    keyword: "ラーメン",
});
const requestURL = hotpepperURL +
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
function hoppepperSearch(url = "") {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch(url)
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
    });
}
