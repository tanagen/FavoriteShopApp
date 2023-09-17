const categoryList = document.getElementById("sortable-list");
const categoryArray = Array.from(categoryList.querySelectorAll("a"));
const loginedUserName = document.querySelector("p").textContent;
let draggedItem = null;
let savedCategories;

console.log(
  JSON.stringify(categoryArray.map((category) => category.textContent).sort())
);
console.log(
  JSON.stringify(
    JSON.parse(localStorage.getItem(loginedUserName.slice(5))).text.sort()
  )
);
// カテゴリーのリスト順序をローカルストレージから読み込む
// ローカルストレージにデータが存在する場合
if (JSON.parse(localStorage.getItem(loginedUserName.slice(5)))) {
  // DB内のカテゴリーとローカルストレージ内のカテゴリーが同一要素か判定（異なる例：新規作成された直後など）
  // 配列の要素同士の比較に、sort()した状態のJSON.stringify()を行う
  const DBCategories = JSON.stringify(
    categoryArray.map((category) => category.textContent).sort()
  );
  const LSCategories = JSON.stringify(
    JSON.parse(localStorage.getItem(loginedUserName.slice(5))).text.sort()
  );

  if (DBCategories !== LSCategories) {
    savedCategories = {
      href: categoryArray.map((category) => category.getAttribute("href")),
      text: categoryArray.map((category) => category.textContent),
    };
  } else {
    savedCategories = JSON.parse(
      localStorage.getItem(loginedUserName.slice(5))
    );
  }
} else {
  // ローカルストレージにデータが存在しない場合
  savedCategories = {
    href: categoryArray.map((category) => category.getAttribute("href")),
    text: categoryArray.map((category) => category.textContent),
  };
}

// リスト順序を初期化
updateCategoryList(savedCategories);

// ドラッグを開始すると呼び出されるイベントハンドラ
function handleDragStart(event) {
  draggedItem = event.target;

  event.dataTransfer.setData("text/plain", draggedItem.textContent); // DataTransfer.setData() メソッドは、ドラッグ操作の drag data に指定したデータと型を設定
}

// ドロップエリアに対してドラッグオーバーしたときに呼び出されるイベントハンドラ
function handleDragOver(event) {
  event.preventDefault();
}

// ドロップエリアでドロップしたときに呼び出されるイベントハンドラ
function handleDrop(event) {
  event.preventDefault();
  if (draggedItem) {
    const dropTarget = event.target;

    if (dropTarget && draggedItem !== dropTarget) {
      // <a>要素の配列を作成し、draggedItemとdropTargetの配列順序を入れ替える
      const categoryArray = Array.from(categoryList.querySelectorAll("a"));
      const draggedIndex = categoryArray.indexOf(draggedItem);
      const targetIndex = categoryArray.indexOf(dropTarget);

      const temp = categoryArray[draggedIndex];
      console.log(temp);
      categoryArray[draggedIndex] = categoryArray[targetIndex];
      categoryArray[targetIndex] = temp;

      // 入れ替え後のリスト順序で、<a>要素のhrefとtextContentをローカルストレージに保存
      const savedCategories = {
        href: categoryArray.map((category) => category.getAttribute("href")),
        text: categoryArray.map((category) => category.textContent),
      };

      localStorage.setItem(
        loginedUserName.slice(5),
        JSON.stringify(savedCategories)
      );

      // ドラッグアンドドロップ操作をUIに反映
      updateCategoryList(savedCategories);
    }
  }
  draggedItem = null;
}

// <a>要素にドラッグイベントリスナーを設定
// const items = document.querySelectorAll(".draggable");
// items.forEach((item) => {
//   item.addEventListener("dragstart", handleDragStart);
//   item.addEventListener("dragover", handleDragOver);
//   item.addEventListener("drop", handleDrop);
// });

// <ul>要素にドラッグイベントリスナーを設定
categoryList.addEventListener("dragstart", handleDragStart);
categoryList.addEventListener("dragover", handleDragOver);
categoryList.addEventListener("drop", handleDrop);

// リスト順序をUIに反映する関数
function updateCategoryList(categoryObj) {
  // 最初にリセット
  categoryList.innerHTML = "";

  // 連想配列から各配列を取り出し、
  const hrefArray = categoryObj.href;
  const textArray = categoryObj.text;

  // pythonのzip風の関数がjavascriptに無いので自作関数を定義
  const zip = (Array1, Array2) => Array1.map((_, i) => [Array1[i], Array2[i]]);
  const categoryArray = zip(hrefArray, textArray);

  // HTMLにリスト順序を反映
  categoryArray.forEach((category) => {
    // 新たに<li>要素と<a>要素を作成
    const newListElement = document.createElement("li");
    const newLinkElement = document.createElement("a");

    // <a>要素に情報追加
    newLinkElement.href = category[0];
    newLinkElement.textContent = category[1];

    // <ul>要素 <li>要素 <a>要素の親子関係を追加
    newListElement.appendChild(newLinkElement);
    categoryList.appendChild(newListElement);
  });
}

// ドロップエリア（<ul>要素）にドラッグオーバーとドロップのイベントリスナーを設定
// const dropArea = document.getElementById("sortable-list");
// dropArea.addEventListener("dragover", handleDragOver);
// dropArea.addEventListener("drop", handleDrop);

// // リロードすると入れ替えが消えるver.
// let draggedItem = null;

// // ドラッグを開始すると呼び出されるイベントハンドラ
// function handleDragStart(event) {
//   draggedItem = event.target;
//   event.dataTransfer.setData("text/plain", draggedItem.textContent);
// }

// // ドロップエリアに対してドラッグオーバーしたときに呼び出されるイベントハンドラ
// function handleDragOver(event) {
//   event.preventDefault();
// }

// // ドロップエリアでドロップしたときに呼び出されるイベントハンドラ
// function handleDrop(event) {
//   event.preventDefault();
//   if (draggedItem) {
//     const dropTarget = event.target;

//     // ドラッグ元とドロップ先の<a>要素の値のみ入れ替え、リンクのhrefは入れ替えない
//     if (dropTarget && draggedItem !== dropTarget) {
//       const tempText = dropTarget.textContent;
//       dropTarget.textContent = event.dataTransfer.getData("text/plain");
//       draggedItem.textContent = tempText;

//       const dropHref = dropTarget.getAttribute("href");
//       const draggedHref = draggedItem.getAttribute("href");
//       dropTarget.setAttribute("href", draggedHref);
//       draggedItem.setAttribute("href", dropHref);
//     }
//   }
// }

// // <a>要素にドラッグイベントリスナーを設定
// const items = document.querySelectorAll(".draggable");
// items.forEach((item) => {
//   item.addEventListener("dragstart", handleDragStart);
//   item.addEventListener("dragover", handleDragOver);
//   item.addEventListener("drop", handleDrop);
// });
