"use strict";
let draggedItem = null;
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
    const dropTarget = event.target;
    // ドラッグ元とドロップ先の<tr>要素を入れ替える
    if (draggedItem && draggedItem !== dropTarget) {
        const tempText = dropTarget.textContent;
        dropTarget.textContent = event.dataTransfer.getData("text/plain");
        draggedItem.textContent = tempText;
    }
}
// <a>要素にドラッグイベントリスナーを設定
const items = document.querySelectorAll(".draggable");
items.forEach((item) => {
    item.addEventListener("dragstart", handleDragStart);
    item.addEventListener("dragover", handleDragOver);
    item.addEventListener("drop", handleDrop);
});
// ドロップエリア（<ul>要素）にドラッグオーバーとドロップのイベントリスナーを設定
// const dropArea = document.getElementById("sortable-list");
// dropArea.addEventListener("dragover", handleDragOver);
// dropArea.addEventListener("drop", handleDrop);
