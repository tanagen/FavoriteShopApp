"use strict";
document.getElementById("search-button").addEventListener("click", () => {
    // HTMLからデータ取得
    const keyword = document.getElementById("name").value;
    const shopLat = JSON.parse(document.getElementById("latlng").value).lat;
    const shopLng = JSON.parse(document.getElementById("latlng").value).lng;
    // Node.jsサーバーにHTTPリクエストを送信するためのコードを追加
    fetch("/hotpepper", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword: keyword, lat: shopLat, lng: shopLng }), // サーバーに送信するデータ
    })
        .then((res) => res.json())
        .then((data) => {
        console.log("サーバーレスポンス:", data);
        // 一旦リセット
        document.getElementById("hotpepper").innerHTML = "";
        if (data.shops[0] !== "該当データなし") {
            data.shops.forEach((element) => {
                // 新たに<li>要素と<a>要素を作成
                const newListElement = document.createElement("li");
                const newLinkElement = document.createElement("a");
                // <a>要素に情報追加
                newLinkElement.textContent = element[0];
                newLinkElement.href = element[1];
                // <ul>要素 <li>要素 <a>要素の親子関係を追加
                newListElement.appendChild(newLinkElement);
                document.getElementById("hotpepper").appendChild(newListElement);
                // document.getElementById("hotpepper").textContent = data.shopNames;
                // document.getElementById("hotpepper").href = data.shopURLs;
            });
        }
        else {
            document.getElementById("hotpepper").textContent = data.shops[0];
        }
    })
        .catch((error) => {
        console.log("サーバーへのHTTPリクエストエラー: ", error);
    });
});
