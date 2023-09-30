import db from "../models/index";
import { Request, Response, NextFunction } from "express";
import UserMemos from "../models/userMemos";

// 選択したカテゴリーの情報を取得
export const getSelectedCategory = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // ログインユーザーのIDをpassportのsessionから取得
  const loginedUserId: number = req.user!.id;

  // 選択したカテゴリーのインデックス番号をルートパラメータから取得し、ローカル変数に格納
  const categoryIndex: number = Number(req.params.index);
  res.locals.index = categoryIndex;

  // 選択中のカテゴリーのDBにおけるIDとカテゴリー名の情報を取得
  (async () => {
    await db.ShopCategories.findAll({
      where: { user_id: loginedUserId },
    }).then((allData) => {
      // 配列に格納
      const CategoryDBIDs: number[] = [];
      const Categories: string[] = [];

      allData.forEach((data) => {
        CategoryDBIDs.push(Number(data.dataValues.id));
        Categories.push(data.dataValues.shop_category);
      });

      // res.localsに格納
      res.locals.selectedCategoryDBId = CategoryDBIDs[categoryIndex];
      res.locals.selectedCategory = Categories[categoryIndex];

      next();
    });
  })();
};

// メモ一覧ページの表示
export const renderMemoPage = (req: Request, res: Response) => {
  // ログインユーザーのIDをpassportのsessionから取得
  const loginedUserId: number = req.user!.id;
  // getSelectedCategoryメソッドで取得したres.localsの内容を取得
  const selectedCategoryIndex = res.locals.index;
  const selectedCategory = res.locals.selectedCategory;

  // DBからデータ取得
  (async () => {
    await db.UserMemos.findAll({
      where: {
        user_id: loginedUserId,
        shop_category: selectedCategory,
      },
    }).then((data) => {
      // データが存在する場合
      if (data.length !== 0) {
        const errorMessage: string = "";
        const memos: UserMemos[] = data;

        res.render("memo", {
          errorMessage: errorMessage,
          memos: memos,
          selectedCategory: selectedCategory,
          selectedCategoryIndex: selectedCategoryIndex,
        });
      } else {
        // データが存在しない場合
        const errorMessage = "メモが登録されていません";
        const memos: string[] = [];

        res.render("memo", {
          errorMessage: errorMessage,
          memos: memos,
          selectedCategory: selectedCategory,
          selectedCategoryIndex: selectedCategoryIndex,
        });
      }
    });
  })();
};

// メモ新規作成ページの表示
export const renderCreateMemoPage = (req: Request, res: Response) => {
  // getSelectedCategoryメソッドで取得したres.localsを取得
  const selectedCategoryIndex = res.locals.index;
  const selectedCategory = res.locals.selectedCategory;
  // getGoogleMapsApiKeyメソッドからres.localsを取得
  const googleMapsApiKey = res.locals.googleMapsApiKey;
  // 緯度経度情報の初期値(東京駅)
  const initLatLng = JSON.stringify({ lat: 35.6811673, lng: 139.7670516 });

  res.render("createMemo", {
    googleMapsApiKey: googleMapsApiKey,
    selectedCategoryIndex: selectedCategoryIndex,
    selectedCategory: selectedCategory,
    shopName: "",
    shopLatLng: initLatLng,
    hotpepperLink: "",
    shopDescription: "",
    errors: {},
  });
};

// メモ新規作成時の入力値空チェック
export const checkCreatingMemo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // getSelectedCategoryメソッドからres.localsを取得
  const selectedCategoryIndex = res.locals.index;
  const selectedCategory = res.locals.selectedCategory;

  // getgoogleMapsApiKeyメソッドからres.localsを取得
  const googleMapsApiKey = res.locals.googleMapsApiKey;

  // postされた値を変数に代入
  const postedShopName = req.body.name;
  const postedShopLatLng = req.body.latlng;
  const postedHotpepperLink = req.body.hotpepper;
  const postedShopDescription = req.body.description;

  // error文格納用の配列
  const errors: { [key: string]: string } = {};

  // errorチェック
  if (postedShopName === "") {
    errors["shopName"] = "入力してください";
  }
  if (postedShopLatLng === "") {
    errors["shopLocation"] = "入力してください";
  }
  if (postedShopDescription === "") {
    errors["shopDescription"] = "入力してください";
  }

  if (Object.keys(errors).length > 0) {
    // 1つでもエラーがある場合
    res.render("createMemo", {
      googleMapsApiKey: googleMapsApiKey,
      selectedCategoryIndex: selectedCategoryIndex,
      selectedCategory: selectedCategory,
      shopName: postedShopName,
      shopLatLng: postedShopLatLng,
      hotpepperLink: postedHotpepperLink,
      shopDescription: postedShopDescription,
      errors: errors,
    });
  } else {
    next();
  }
};

// メモ更新時の入力値空チェック
export const checkUpdatingMemo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // getSelectedCategoryメソッドで取得したres.localsの内容を取得
  const selectedCategoryIndex = res.locals.index;
  const selectedCategory = res.locals.selectedCategory;

  // 選択したメモのIDをルートパラメータから取得
  const selectedMemoId = req.params.id;

  // postされた内容を変数に代入
  const postedShopName = req.body.name;
  const postedShopLatLng = req.body.latlng;
  const postedHotpepperLink = req.body.hotpepper;
  const postedShopDescription = req.body.description;

  // error文格納用の配列
  const errors: { [key: string]: string } = {};

  // errorチェック
  if (postedShopName === "") {
    errors["shopName"] = "入力してください";
  }
  if (postedShopLatLng === "") {
    errors["shopLocation"] = "入力してください";
  }
  if (postedShopDescription === "") {
    errors["shopDescription"] = "入力してください";
  }

  if (Object.keys(errors).length > 0) {
    res.render("editMemo", {
      selectedCategoryIndex: selectedCategoryIndex,
      selectedCategory: selectedCategory,
      selectedMemoId: selectedMemoId,
      shopName: postedShopName,
      shopLatLng: postedShopLatLng,
      hotpepperLink: postedHotpepperLink,
      shopDescription: postedShopDescription,
      errorMessage: "",
      errors: errors,
    });
  } else {
    next();
  }
};

// メモの新規作成
export const createMemo = (req: Request, res: Response) => {
  // ログインユーザーのIDをpassportのsessionから取得
  const loginedUserId: number = req.user!.id;
  // 新規作成するメモが属するカテゴリーのインデックス番号をルートパラメータから取得
  const selectedCategoryIndex = req.params.index;
  // getSelectedCategoryメソッドで取得したres.localsの内容を取得
  const selectedCategory = res.locals.selectedCategory;
  // formでpostされた内容を取得
  const createdShopName = req.body.name;
  const createdShopLatLng = req.body.latlng;
  const createdHotpepperLink = req.body.hotpepper;
  const createdShopDescription = req.body.description;

  // postされた内容をuser_favorite_shopsDBに格納
  (async () => {
    try {
      // createメソッドはbuild+saveを一度に行い、データベースにinsertまで行う
      await db.UserMemos.create({
        user_id: loginedUserId,
        shop_category: selectedCategory,
        shop_name: createdShopName,
        shop_location: createdShopLatLng,
        shop_hotpepperlink: createdHotpepperLink,
        shop_description: createdShopDescription,
      });
    } catch (error) {
      console.log(error);
    }

    // redirect
    const redirectURL = "/memo/" + selectedCategoryIndex;
    res.redirect(redirectURL);
  })();
};

// メモの削除
export const deleteMemo = (req: Request, res: Response) => {
  // 削除対象のメモが属するカテゴリーのインデックス番号をルートパラメータから取得
  const selectedCategoryIndex = req.params.index;

  // DBから削除
  (async () => {
    try {
      await db.UserMemos.destroy({
        where: {
          id: req.params.id,
        },
      });
    } catch (error) {
      console.log(error);
    }

    // redirect
    const redirectURL = "/memo/" + selectedCategoryIndex;
    res.redirect(redirectURL);
  })();
};

// 選択したメモの情報をDBから取得
export const getSelectedMemo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 選択したメモのIDをルートパラメータから取得
  const selectedMemoID = req.params.id;

  // 選択したメモの情報をDBから取得
  (async () => {
    await db.UserMemos.findAll({
      where: {
        id: selectedMemoID,
      },
    }).then((data) => {
      // データが存在する場合
      if (data.length !== 0) {
        const errorMessage: string = "";
        const selectedMemo: UserMemos = data[0];

        res.locals.errorMessage = errorMessage;
        res.locals.selectedMemo = selectedMemo;
      } else {
        // データが存在しない場合
        const errorMessage = "情報取得エラー";

        res.locals.errorMessage = errorMessage;
        res.locals.selectedMemo = "";
      }

      next();
    });
  })();
};

// リスト編集画面の表示
export const renderEditMemoPage = (req: Request, res: Response) => {
  // getSelectedCategoryメソッドで取得したres.localsを取得
  const selectedCategoryIndex = res.locals.index;
  const selectedCategory = res.locals.selectedCategory;
  // 選択したメモのIDをルートパラメータから取得
  const selectedMemoId = req.params.id;
  // getGoogleMapsApiKeyメソッドで取得したres.localsを取得
  const googleMapsApiKey = res.locals.googleMapsApiKey;

  // 選択したメモの情報をDBから取得
  (async () => {
    await db.UserMemos.findAll({
      where: {
        id: selectedMemoId,
      },
    }).then((data) => {
      if (data.length !== 0) {
        // データが存在する場合
        const errorMessage: string = "";
        const selectedMemo: UserMemos = data[0];
        const shopName = selectedMemo.shop_name;
        const shopLatLng = selectedMemo.shop_location;
        const hotpepperLink = selectedMemo.shop_hotpepperlink;
        const shopDescription = selectedMemo.shop_description;

        // レンダリング
        res.render("editMemo", {
          googleMapsApiKey: googleMapsApiKey,
          selectedCategoryIndex: selectedCategoryIndex,
          selectedCategory: selectedCategory,
          selectedMemoId: selectedMemoId,
          shopName: shopName,
          shopLatLng: shopLatLng,
          hotpepperLink: hotpepperLink,
          shopDescription: shopDescription,
          errors: "",
          errorMessage: errorMessage,
        });
        // データが存在しない場合
      } else {
        throw new Error("DBにデータがありません");
      }
    });
  })();
};

export const updateMemo = (req: Request, res: Response) => {
  // 更新するメモが属するカテゴリーのインデックス番号をルートパラメータから取得
  const selectedCategoryIndex = req.params.index;
  // 更新するメモのIDをルートパラメータから取得
  const selectedMemoId = req.params.id;

  // DBを更新
  (async () => {
    try {
      await db.UserMemos.update(
        {
          shop_name: req.body.name,
          shop_location: req.body.latlng,
          shop_hotpepperlink: req.body.hotpepper,
          shop_description: req.body.description,
        },
        { where: { id: selectedMemoId } }
      );
    } catch (error) {
      console.log(error);
    }

    // redirect
    const redirectURL = "/memo/" + selectedCategoryIndex;
    res.redirect(redirectURL);
  })();
};
