// フォーム送信時の処理
document.getElementById("shop-form").addEventListener("submit", (event) => {
  event.preventDefault(); // フォームの通常の送信を防止

  // フォームデータを取得
  const formData = new FormData(event.target);

  // フォームデータからメッセージを取得
  const shopName = formData.get("shop-name");

  console.log(shopName);

  // 結果を表示する要素に表示
  document.getElementById(
    "show-map"
  ).innerHTML = `<p>入力されたメッセージ: ${shopName}</p>`;
});
