"use strict";
const categoryList = document.getElementById("sortable-list");
console.log(categoryList);
let draggedItem = null;
// カテゴリーのリスト順序をローカルストレージから読み込む
const savedCategories = 
// JSON.parse(localStorage.getItem("savedCategories")) ||
categoryList.querySelectorAll("li"); // ||は論理和で「左辺がtrueの時は左辺を返し、それ以外は右辺を返す」
console.log(savedCategories);
// リスト順序を初期化
updateCategoryList(savedCategories);
// ドラッグを開始すると呼び出されるイベントハンドラ
function handleDragStart(event) {
    draggedItem = event.target;
    event.dataTransfer.setData("text/plain", draggedItem.textContent);
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
            // ドラッグ元とドロップ先の<a>要素の値のみ入れ替え、リンクのhrefは入れ替えない
            // const tempText = dropTarget.textContent;
            // dropTarget.textContent = event.dataTransfer.getData("text/plain");
            // draggedItem.textContent = tempText;
            // const dropHref = dropTarget.getAttribute("href");
            // const draggedHref = draggedItem.getAttribute("href");
            // dropTarget.setAttribute("href", draggedHref);
            // draggedItem.setAttribute("href", dropHref);
            // ドラッグ元とドラッグ先のリンク順序を入れ替え
            const categories = Array.from(categoryList.querySelectorAll("li"));
            const draggedIndex = categories.indexOf(draggedItem);
            const targetIndex = categories.indexOf(dropTarget);
            const temp = categories[draggedIndex];
            categories[draggedIndex] = categories[targetIndex];
            categories[targetIndex] = categories[temp];
            // リスト順序をローカルストレージに保存
            const savedCategories = categories;
            localStorage.setItem("savedCategories", JSON.stringify(savedCategories));
            // ドラッグアンドドロップ操作をUIに反映
            updateCategoryList(categories);
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
function updateCategoryList(categories) {
    categoryList.innerHTML = "";
    categories.forEach((category) => {
        console.log(category);
        categoryList.innerHTML(category);
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
