let categoryList = document.getElementById("sortable-list");
let categoryArray = Array.from(categoryList.querySelectorAll("a"));
const loginedUserName = document.querySelector("p").textContent;
let draggedItem = null;
let savedCategories;

// 現在のカテゴリーリストの要素順序を取得する
// データベース(DS)とローカルストレージ(LS)の情報を比較して場合分け
if (JSON.parse(localStorage.getItem(loginedUserName.slice(5, -2)))) {
  // LSにデータが存在する場合

  // 現在のDBカテゴリー情報とLSカテゴリー情報を取得
  let DBCategoryHrefs = categoryArray.map((category) =>
    category.getAttribute("href")
  );
  let DBCategoryTexts = categoryArray.map((category) => category.textContent);
  let LSCategoryHrefs = JSON.parse(
    localStorage.getItem(loginedUserName.slice(5, -2))
  ).href;
  let LSCategoryTexts = JSON.parse(
    localStorage.getItem(loginedUserName.slice(5, -2))
  ).text;

  if (
    JSON.stringify(DBCategoryHrefs.sort()).length >
    JSON.stringify(LSCategoryHrefs.sort()).length
  ) {
    // 配列の要素同士の比較に、sort()した状態のJSON.stringify()を利用
    // カテゴリーを新規作成した場合（LSの要素数がDBより少ない）

    // FIXME: 再定義しないと、なぜか配列順序がめちゃくちゃになる
    let DBCategoryHrefs = categoryArray.map((category) =>
      category.getAttribute("href")
    );
    let DBCategoryTexts = categoryArray.map((category) => category.textContent);
    let LSCategoryHrefs = JSON.parse(
      localStorage.getItem(loginedUserName.slice(5, -2))
    ).href;
    let LSCategoryTexts = JSON.parse(
      localStorage.getItem(loginedUserName.slice(5, -2))
    ).text;

    // DB末尾から新規作成されたカテゴリーを取得して、LSのリスト順序の末尾に追加
    let diffHref = DBCategoryHrefs.slice(-1)[0];
    let diffText = DBCategoryTexts.slice(-1)[0];
    LSCategoryHrefs.push(diffHref);
    LSCategoryTexts.push(diffText);

    savedCategories = {
      href: LSCategoryHrefs,
      text: LSCategoryTexts,
    };

    // ローカルストレージの更新
    localStorage.setItem(
      loginedUserName.slice(5, -2),
      JSON.stringify(savedCategories)
    );
  } else if (
    JSON.stringify(DBCategoryHrefs.sort()).length <
    JSON.stringify(LSCategoryHrefs.sort()).length
  ) {
    // カテゴリーを削除した場合（LSの要素数がDBより多い）

    // FIXME: 再定義しないと、なぜか配列順序がめちゃくちゃになる
    let DBCategoryHrefs = categoryArray.map((category) =>
      category.getAttribute("href")
    );
    let DBCategoryTexts = categoryArray.map((category) => category.textContent);
    let LSCategoryHrefs = JSON.parse(
      localStorage.getItem(loginedUserName.slice(5, -2))
    ).href;
    let LSCategoryTexts = JSON.parse(
      localStorage.getItem(loginedUserName.slice(5, -2))
    ).text;

    // LSのカテゴリー名のうち、DBにも含まれるものを抽出（カテゴリー削除後のLSの配列を取得）
    let newLSCategoryTexts = LSCategoryTexts.filter((text) =>
      DBCategoryTexts.includes(text)
    );

    //　LSのカテゴリーの要素順序となるDBのインデックス番号を取得
    let indicesFromDBCategoryTexts = getIndicesFromBtoA(
      DBCategoryTexts,
      newLSCategoryTexts
    );

    //　上記のインデックス番号に対応するDBのhrefを取得
    let hrefsFromDBCategoryHrefs = getValuesFromIndices(
      DBCategoryHrefs,
      indicesFromDBCategoryTexts
    );

    savedCategories = {
      href: hrefsFromDBCategoryHrefs,
      text: newLSCategoryTexts,
    };

    // ローカルストレージの更新
    localStorage.setItem(
      loginedUserName.slice(5, -2),
      JSON.stringify(savedCategories)
    );
  } else if (
    JSON.stringify(DBCategoryTexts.sort()) !==
    JSON.stringify(LSCategoryTexts.sort())
  ) {
    // カテゴリー名を編集した場合（DBとLSの要素数は同じだけど、textContentが異なる）

    // FIXME: 再定義しないと、なぜか配列順序がめちゃくちゃになる
    let DBCategoryHrefs = categoryArray.map((category) =>
      category.getAttribute("href")
    );
    let DBCategoryTexts = categoryArray.map((category) => category.textContent);
    let LSCategoryHrefs = JSON.parse(
      localStorage.getItem(loginedUserName.slice(5, -2))
    ).href;
    let LSCategoryTexts = JSON.parse(
      localStorage.getItem(loginedUserName.slice(5, -2))
    ).text;

    // 更新前のカテゴリー名を取得
    let beforeUpdateText = LSCategoryTexts.filter(
      (text) => !DBCategoryTexts.includes(text)
    );

    // 更新されたカテゴリー名に対応するLSのインデックス番号を取得
    let updatedLSIndex = LSCategoryTexts.indexOf(beforeUpdateText[0]); // 更新は1個ずつしか行わないことを前提に[0]を記載

    // 更新後のカテゴリー名を取得
    let afterUpdateText = DBCategoryTexts.filter(
      (text) => !LSCategoryTexts.includes(text)
    );

    // LSのカテゴリー名を更新
    LSCategoryTexts[updatedLSIndex] = afterUpdateText[0]; // 更新は1個ずつしか行わないことを前提に[0]を記載

    savedCategories = {
      href: LSCategoryHrefs,
      text: LSCategoryTexts,
    };

    // ローカルストレージの更新
    localStorage.setItem(
      loginedUserName.slice(5, -2),
      JSON.stringify(savedCategories)
    );
  } else {
    // DBとLSの情報が同一の場合
    savedCategories = JSON.parse(
      localStorage.getItem(loginedUserName.slice(5, -2))
    );
  }
} else {
  // LSにデータが存在しない場合
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
      categoryArray[draggedIndex] = categoryArray[targetIndex];
      categoryArray[targetIndex] = temp;

      // 入れ替え後のリスト順序で、<a>要素のhrefとtextContentをローカルストレージに保存
      const savedCategories = {
        href: categoryArray.map((category) => category.getAttribute("href")),
        text: categoryArray.map((category) => category.textContent),
      };

      localStorage.setItem(
        loginedUserName.slice(5, -2),
        JSON.stringify(savedCategories)
      );

      // ドラッグアンドドロップ操作をUIに反映
      updateCategoryList(savedCategories);
    }
  }
  draggedItem = null;
}

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

// Bの配列順序に対応するAのインデックス番号を取得する関数 ※indices:indexの複数形
function getIndicesFromBtoA(A, B) {
  const indices = [];
  B.forEach((elementFromB) => {
    const indexInA = A.indexOf(elementFromB);
    indices.push(indexInA);
  });
  return indices;
}

function getValuesFromIndices(array, indices) {
  const values = [];
  indices.forEach((index) => {
    const value = array[index];
    values.push(value);
  });
  return values;
}
