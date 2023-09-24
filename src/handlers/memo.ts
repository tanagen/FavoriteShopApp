import db from "../models/index";
import { Request, Response, NextFunction } from "express";
import UserMemos from "../models/userMemos";

// 操作中のカテゴリー名を取得
export const getSelectedCategory = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // passportのsessionからidを取得
  const loginedUserId: number = req.user!.id;

  // ルートパラメータからカテゴリーのインデックス番号を取得
  const categoryIndex: number = Number(req.params.index);
  res.locals.index = categoryIndex;

  // shop_categoriesDBから選択中のカテゴリーのid,shop_categoryを取得
  (async () => {
    await db.ShopCategories.findAll({
      where: { user_id: loginedUserId },
    }).then((allData) => {
      // shop_categoryを配列に格納
      // const shopCategoryObj: {} = {};
      const shopCategoryIds: number[] = [];
      const shopCategories: string[] = [];

      allData.forEach((data) => {
        // const key: string = data.dataValues.id;
        // shopCategoryObj[key] = data.dataValues.shop_category;
        shopCategoryIds.push(Number(data.dataValues.id));
        shopCategories.push(data.dataValues.shop_category);
      });

      // 重複排除
      // const setedShopCategories: string[] = Array.from(new Set(shopCategories));
      // ルートパラメータで渡されたcategoryIndexのカテゴリー名をres.localsに格納
      // res.locals.selectedCategory = setedShopCategories[categoryIndex];
      res.locals.selectedCategoryDBId = shopCategoryIds[categoryIndex];
      res.locals.selectedCategory = shopCategories[categoryIndex];

      next();
    });
  })();
};

// メモ一覧の表示
export const renderMemoPage = (req: Request, res: Response) => {
  // passportのsessionからid,user_nameを取得
  const loginedUserId: number = req.user!.id;
  // getSelectedCategoryメソッドで取得したres.localsの内容を変数に代入
  const selectedCategoryIndex = res.locals.index;
  const selectedCategory = res.locals.selectedCategory;

  // user_favorite_shopsDBからデータ取得
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
        const allShopInfo: UserMemos[] = data;

        // レンダリング
        res.render("memo", {
          errorMessage: errorMessage,
          allShopInfo: allShopInfo,
          categoryIndex: res.locals.index,
        });
        // データが存在しない場合
      } else {
        const errorMessage = "メモが登録されていません";
        const allShopInfo: string[] = [];

        // レンダリング
        res.render("memo", {
          errorMessage: errorMessage,
          allShopInfo: allShopInfo,
          categoryIndex: selectedCategoryIndex,
        });
      }
    });
  })();
};

// メモ新規登録画面の表示
export const renderCreateMemoPage = (req: Request, res: Response) => {
  // getSelectedCategoryメソッドで取得したres.localsの内容を変数に代入
  const categoryIndex = res.locals.index;
  const selectedCategory = res.locals.selectedCategory;
  // getAPIKeyメソッドからローカル変数を取得して変数に格納
  const API_KEY = res.locals.apiKey;
  // getHotPepperApiKeyメソッドからローカル変数を取得して変数に格納
  const HOT_PEPPER_API_KEY = res.locals.hotpepperApiKey;
  // 緯度経度情報の初期値(東京駅)
  const initLatLng = JSON.stringify({ lat: 35.6811673, lng: 139.7670516 });

  res.render("createMemo", {
    apiKey: API_KEY,
    hotpepperApiKey: HOT_PEPPER_API_KEY,
    categoryIndex: categoryIndex,
    selectedCategory: selectedCategory,
    shopName: "",
    latlng: initLatLng,
    shopDescription: "",
    errors: {},
  });
};

// メモ新規登録における入力値の空チェック
export const checkCreatingMemo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // getSelectedCategoryメソッドで取得したres.localsの内容を変数に代入
  const categoryIndex = res.locals.index;
  const selectedCategory = res.locals.selectedCategory;

  // getAPIKeyメソッドからローカル変数を取得して変数に格納
  const API_KEY = res.locals.apiKey;

  // postされた値を変数に代入
  const postedShopName = req.body.name;
  const postedShopLocation = req.body.latlng;
  const postedShopDescription = req.body.description;
  console.log(req.body);

  // error文格納用の配列
  const errors: { [key: string]: string } = {};

  // errorチェック
  if (postedShopName === "") {
    errors["shopName"] = "入力してください";
  }
  if (postedShopLocation === "") {
    errors["shopLocation"] = "入力してください";
  }
  if (postedShopDescription === "") {
    errors["shopDescription"] = "入力してください";
  }

  if (Object.keys(errors).length > 0) {
    res.render("createMemo", {
      apiKey: API_KEY,
      categoryIndex: categoryIndex,
      selectedCategory: selectedCategory,
      shopName: postedShopName,
      latlng: postedShopLocation,
      shopDescription: postedShopDescription,
      errors: errors,
    });
  } else {
    next();
  }
};

// メモ更新における入力値の空チェックミドルウェア
export const checkUpdatingMemo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // getSelectedCategoryメソッドで取得したres.localsの内容を変数に代入
  const categoryIndex = res.locals.index;
  const selectedCategory = res.locals.selectedCategory;

  // ルートパラメータから選択したlistIDを取得
  const selectedShopId = req.params.id;

  // postされた内容を変数に代入
  const postedShopName = req.body.name;
  const postedShopLocation = req.body.latlng;
  const postedShopDescription = req.body.description;

  // error文格納用の配列
  const errors: { [key: string]: string } = {};

  // errorチェック
  if (postedShopName === "") {
    errors["shopName"] = "入力してください";
  }
  if (postedShopLocation === "") {
    errors["shopLocation"] = "入力してください";
  }
  if (postedShopDescription === "") {
    errors["shopDescription"] = "入力してください";
  }

  if (Object.keys(errors).length > 0) {
    res.render("editMemo", {
      selectedCategory: selectedCategory,
      errorMessage: "",
      shopId: selectedShopId,
      shopName: postedShopName,
      latlng: postedShopLocation,
      shopDescription: postedShopDescription,
      categoryIndex: categoryIndex,
      errors: errors,
    });
  } else {
    next();
  }
};

// メモの新規登録
export const createMemo = (req: Request, res: Response) => {
  // passportのsessionからidを取得
  const loginedUserId: number = req.user!.id;
  // ルートパラメータからcategoryIndexを取得して変数に代入
  const selectedCategoryIndex = req.params.index;
  // getSelectedCategoryメソッドで取得したres.localsの内容を変数に代入
  const selectedCategory = res.locals.selectedCategory;
  // formでpostされた内容を取得
  const createdShopName = req.body.name;
  const createdLatLng = req.body.latlng;
  const createdHotpepperLink = req.body.hotpepper;
  const createdDescription = req.body.description;

  console.log(createdLatLng);

  // postされた内容をuser_favorite_shopsDBに格納
  (async () => {
    // const t = await db.UserFavoriteShops.sequelize!.transaction();

    try {
      // createメソッドはbuild+saveを一度に行い、データベースにinsertまで行う
      await db.UserMemos.create({
        user_id: loginedUserId,
        shop_category: selectedCategory,
        shop_name: createdShopName,
        shop_location: createdLatLng,
        shop_hotpepperlink: createdHotpepperLink,
        shop_description: createdDescription,
      });

      // await t?.commit;
    } catch (error) {
      console.log(error);
      // await t?.rollback();
    }

    // redirect
    const redirectURL = "/memo/" + selectedCategoryIndex;
    res.redirect(redirectURL);
  })();
};

// メモの削除
export const deleteMemo = (req: Request, res: Response) => {
  const selectedCategoryIndex = req.params.index;

  (async () => {
    try {
      // Users.createメソッドは下記のbuild+saveを一度に行い、データベースにinsertまで行う
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

// 選択したメモの情報取得
export const getInfoOfSelectedMemo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // ルートパラメータから選択したリストIdを取得
  const selectedShopId = req.params.id;

  // 選択したリストIdの情報をuser_favorite_shopsDBから取得
  (async () => {
    // user_favorite_shopsDBからデータ取得
    await db.UserMemos.findAll({
      where: {
        id: selectedShopId,
      },
    }).then((data) => {
      // データが存在する場合
      if (data.length !== 0) {
        const errorMessage: string = "";
        const shopInfo: UserMemos = data[0];
        // const shopId = shopInfo.id;
        // const shopName = shopInfo.shop_name;
        // const shopLocation = shopInfo.shop_location;
        // const shopDescription = shopInfo.shop_description;

        res.locals.errorMessage = errorMessage;
        res.locals.selectedShopInfo = shopInfo;
        // データが存在しない場合
      } else {
        const errorMessage = "情報取得エラー";
        // const shopId: any = "";
        // const shopName: any = "";
        // const shopLocation: any = "";
        // const shopDescription: any = "";

        res.locals.errorMessage = errorMessage;
        res.locals.selectedShopInfo = "";
      }

      next();
    });
  })();
};

// リスト編集画面の表示
export const renderEditMemoPage = (req: Request, res: Response) => {
  // getSelectedCategoryメソッドで取得したres.localsの内容を変数に代入
  const categoryIndex = res.locals.index;
  const selectedCategory = res.locals.selectedCategory;
  // ルートパラメータから選択したリストIdを取得
  const selectedShopId = req.params.id;

  // 選択したリストIdの情報をuser_favorite_shopsDBから取得
  (async () => {
    // user_favorite_shopsDBからデータ取得
    await db.UserMemos.findAll({
      where: {
        id: selectedShopId,
      },
    }).then((data) => {
      // データが存在する場合
      if (data.length !== 0) {
        const errorMessage: string = "";
        const shopInfo: any = data[0];
        const shopId = shopInfo.id;
        const shopName = shopInfo.shop_name;
        const shopLatLng = shopInfo.shop_location;
        const hotpepperLink = shopInfo.shop_hotpepperlink;
        const shopDescription = shopInfo.shop_description;

        // レンダリング
        res.render("editMemo", {
          selectedCategory: selectedCategory,
          errorMessage: errorMessage,
          shopId: shopId,
          shopName: shopName,
          latlng: shopLatLng,
          hotpepperLink: hotpepperLink,
          shopDescription: shopDescription,
          categoryIndex: categoryIndex,
          errors: "",
        });
        // データが存在しない場合
      } else {
        const errorMessage = "情報取得エラー";
        const shopId: any = "";
        const shopName: any = "";
        const shopLatLng: any = "";
        const shopDescription: any = "";

        // レンダリング
        res.render("editMemo", {
          selectedCategory: selectedCategory,
          errorMessage: errorMessage,
          shopId: shopId,
          shopName: shopName,
          latlng: shopLatLng,
          shopDescription: shopDescription,
          categoryIndex: categoryIndex,
          errors: "",
        });
      }
    });
  })();
};

export const updateMemo = (req: Request, res: Response) => {
  // post先URLのルートパラメータを変数に代入
  const selectedCategoryIndex = req.params.index;
  const selectedShopId = req.params.id;

  // user_favorite_shopsDBの選択したリストIdの情報を更新
  (async () => {
    try {
      await db.UserMemos.update(
        {
          shop_name: req.body.name,
          shop_location: req.body.latlng,
          shop_hotpepperlink: req.body.hotpepper,
          shop_description: req.body.description,
        },
        { where: { id: selectedShopId } }
      );
    } catch (error) {
      console.log(error);
    }

    // redirect
    const redirectURL = "/memo/" + selectedCategoryIndex;
    res.redirect(redirectURL);
  })();
};
