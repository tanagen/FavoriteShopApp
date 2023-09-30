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
        // サーバーから取得したデータに応じて対応を分ける
        if (data.shops[0][0] === "該当データなし") {
            // 一旦HTMLをリセット
            document.getElementById("hotpepper").innerHTML = "";
            document.getElementById("hotpepper").textContent = data.shops[0][0];
        }
        else if (data.shops[0][0] === "検索ワードを入れてください") {
            alert("検索ワードを入れてください");
        }
        else {
            // 一旦HTMLをリセット
            document.getElementById("hotpepper").innerHTML = "";
            data.shops.forEach((element) => {
                // 新たに<li>要素と<input>要素と<a>要素を作成
                const newListElement = document.createElement("list");
                const newInputElement = document.createElement("input");
                newInputElement.type = "radio";
                newInputElement.name = "hotpepper";
                newInputElement.value = element[1]; // hotpepperURL
                const newLinkElement = document.createElement("a");
                newLinkElement.textContent = element[0];
                newLinkElement.href = element[1];
                newLinkElement.target = "_blank"; // 新規タブで表示する設定
                // 親子関係を追加
                newListElement.appendChild(newInputElement);
                newListElement.appendChild(newLinkElement);
                document.getElementById("hotpepper").appendChild(newListElement);
            });
        }
    })
        .catch((error) => {
        console.log("サーバーへのHTTPリクエストエラー: ", error);
    });
});
