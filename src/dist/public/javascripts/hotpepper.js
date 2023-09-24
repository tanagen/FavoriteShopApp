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
                // 新たに<input>要素と<label>要素を作成
                const newInputElement = document.createElement("input");
                const newLabelElement = document.createElement("label");
                newInputElement.type = "checkbox";
                newInputElement.name = "hotpepper";
                newInputElement.value = element[1]; // hotpepperURL
                newInputElement.id = element[0]; // 店名
                newLabelElement.textContent = element[0];
                newLabelElement.htmlFor = element[0];
                // <ul>要素 <li>要素 <a>要素の親子関係を追加
                // newInputElement.appendChild(newLabelElement);
                document.getElementById("hotpepper").appendChild(newInputElement);
                document.getElementById("hotpepper").appendChild(newLabelElement);
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
