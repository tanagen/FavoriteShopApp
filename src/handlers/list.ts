import db from "../models/index";
import { Request, Response, NextFunction } from "express";
import UserFavoriteShops from "../models/userFavoriteShops";

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

// リスト一覧の表示
export const renderListPage = (req: Request, res: Response) => {
  // passportのsessionからid,user_nameを取得
  const loginedUserId: number = req.user!.id;
  // getSelectedCategoryメソッドで取得したres.localsの内容を変数に代入
  const selectedCategoryIndex = res.locals.index;
  const selectedCategory = res.locals.selectedCategory;

  // user_favorite_shopsDBからデータ取得
  (async () => {
    await db.UserFavoriteShops.findAll({
      where: {
        user_id: loginedUserId,
        shop_category: selectedCategory,
      },
    }).then((data) => {
      // データが存在する場合
      if (data.length !== 0) {
        const errorMessage: string = "";
        const allShopInfo: UserFavoriteShops[] = data;

        // レンダリング
        res.render("list", {
          errorMessage: errorMessage,
          allShopInfo: allShopInfo,
          categoryIndex: res.locals.index,
        });
        // データが存在しない場合
      } else {
        const errorMessage = "メモが登録されていません";
        const allShopInfo: string[] = [];

        // レンダリング
        res.render("list", {
          errorMessage: errorMessage,
          allShopInfo: allShopInfo,
          categoryIndex: selectedCategoryIndex,
        });
      }
    });
  })();
};

// リスト新規登録画面の表示
export const renderCreateListPage = (req: Request, res: Response) => {
  // getSelectedCategoryメソッドで取得したres.localsの内容を変数に代入
  const categoryIndex = res.locals.index;
  const selectedCategory = res.locals.selectedCategory;
  // getAPIKeyメソッドからローカル変数を取得して変数に格納
  const API_KEY = res.locals.apiKey;

  res.render("createList", {
    apiKey: API_KEY,
    categoryIndex: categoryIndex,
    selectedCategory: selectedCategory,
    shopName: "",
    latlng: "",
    shopDescription: "",
    errors: {},
  });
};

// リスト新規登録における入力値の空チェックミドルウェア
export const checkPostedNewList = (
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
    res.render("createList", {
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

// リスト更新における入力値の空チェックミドルウェア
export const checkPostedUpdateList = (
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
    res.render("editList", {
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

// リストの新規登録
export const createList = (req: Request, res: Response) => {
  // passportのsessionからidを取得
  const loginedUserId: number = req.user!.id;
  // ルートパラメータからcategoryIndexを取得して変数に代入
  const selectedCategoryIndex = req.params.index;
  // getSelectedCategoryメソッドで取得したres.localsの内容を変数に代入
  const selectedCategory = res.locals.selectedCategory;
  // formでpostされた内容を取得
  const createdShopName = req.body.name;
  const createdLatLng = req.body.latlng;
  const createdDescription = req.body.description;

  console.log(createdLatLng);

  // postされた内容をuser_favorite_shopsDBに格納
  (async () => {
    // const t = await db.UserFavoriteShops.sequelize!.transaction();

    try {
      // createメソッドはbuild+saveを一度に行い、データベースにinsertまで行う
      await db.UserFavoriteShops.create({
        user_id: loginedUserId,
        shop_category: selectedCategory,
        shop_name: createdShopName,
        shop_location: createdLatLng,
        shop_description: createdDescription,
      });

      // await t?.commit;
    } catch (error) {
      console.log(error);
      // await t?.rollback();
    }

    // redirect
    const redirectURL = "/list/" + selectedCategoryIndex;
    res.redirect(redirectURL);
  })();
};

// リストの削除
export const deleteList = (req: Request, res: Response) => {
  const selectedCategoryIndex = req.params.index;

  (async () => {
    try {
      // Users.createメソッドは下記のbuild+saveを一度に行い、データベースにinsertまで行う
      await db.UserFavoriteShops.destroy({
        where: {
          id: req.params.id,
        },
      });
    } catch (error) {
      console.log(error);
    }

    // redirect
    const redirectURL = "/list/" + selectedCategoryIndex;
    res.redirect(redirectURL);
  })();
};

// 選択したリストの情報取得
export const getSelectedList = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // ルートパラメータから選択したリストIdを取得
  const selectedShopId = req.params.id;

  // 選択したリストIdの情報をuser_favorite_shopsDBから取得
  (async () => {
    // user_favorite_shopsDBからデータ取得
    await db.UserFavoriteShops.findAll({
      where: {
        id: selectedShopId,
      },
    }).then((data) => {
      // データが存在する場合
      if (data.length !== 0) {
        const errorMessage: string = "";
        const shopInfo: UserFavoriteShops = data[0];
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
export const renderEditListPage = (req: Request, res: Response) => {
  // getSelectedCategoryメソッドで取得したres.localsの内容を変数に代入
  const categoryIndex = res.locals.index;
  const selectedCategory = res.locals.selectedCategory;
  // ルートパラメータから選択したリストIdを取得
  const selectedShopId = req.params.id;

  // 選択したリストIdの情報をuser_favorite_shopsDBから取得
  (async () => {
    // user_favorite_shopsDBからデータ取得
    await db.UserFavoriteShops.findAll({
      where: {
        id: selectedShopId,
      },
    }).then((data) => {
      // データが存在する場合
      if (data.length !== 0) {
        const errorMessage: string = "";
        const shopInfo: UserFavoriteShops = data[0];
        const shopId = shopInfo.id;
        const shopName = shopInfo.shop_name;
        const shopLatLng = shopInfo.shop_location;
        const shopDescription = shopInfo.shop_description;

        // レンダリング
        res.render("editList", {
          selectedCategory: selectedCategory,
          errorMessage: errorMessage,
          shopId: shopId,
          shopName: shopName,
          latlng: shopLatLng,
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
        res.render("editList", {
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

export const updateList = (req: Request, res: Response) => {
  // post先URLのルートパラメータを変数に代入
  const selectedCategoryIndex = req.params.index;
  const selectedShopId = req.params.id;

  // user_favorite_shopsDBの選択したリストIdの情報を更新
  (async () => {
    try {
      await db.UserFavoriteShops.update(
        {
          shop_name: req.body.name,
          shop_location: req.body.latlng,
          shop_description: req.body.description,
        },
        { where: { id: selectedShopId } }
      );
    } catch (error) {
      console.log(error);
    }

    // redirect
    const redirectURL = "/list/" + selectedCategoryIndex;
    res.redirect(redirectURL);
  })();
};
