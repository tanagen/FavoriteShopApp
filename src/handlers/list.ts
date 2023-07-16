import db from "../models/index";
import { Request, Response, NextFunction } from "express";
import UserFavoriteShops from "../models/userFavoriteShops";

// sessionに格納したloginedUser情報を変数に格納
const loginedUserId: number = 1;
const loginedUserName: string = "gen";

// 操作中のカテゴリー名を取得
export const getSelectedCategory = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // ルートパラメータからカテゴリーのインデックス番号を取得
  const categoryIndex: number = Number(req.params.index);
  res.locals.index = categoryIndex;

  (async () => {
    // shop_categoriesDBからデータ取得
    await db.ShopCategories.findAll({
      where: { user_id: loginedUserId },
    }).then((allData) => {
      // shop_categoryを配列に格納
      const shopCategories: string[] = [];
      allData.forEach((data) => {
        shopCategories.push(data.dataValues.shop_category);
      });

      // 重複排除
      const setedShopCategories: string[] = Array.from(new Set(shopCategories));
      // ルートパラメータで渡されたcategoryIndexのカテゴリー名をres.localsに格納
      res.locals.selectedCategory = setedShopCategories[categoryIndex];

      next();
    });
  })();
};

// リスト一覧の表示
export const renderListPage = (req: Request, res: Response) => {
  (async () => {
    // user_favorite_shopsDBからデータ取得
    await db.UserFavoriteShops.findAll({
      where: {
        user_id: loginedUserId,
        shop_category: res.locals.selectedCategory,
      },
    }).then((data) => {
      // データが存在する場合
      if (data.length !== 0) {
        const errorMessage: string = "";
        const allShopInfo: UserFavoriteShops[] = data;

        // レンダリング
        res.render("list.ejs", {
          errorMessage: errorMessage,
          allShopInfo: allShopInfo,
          categoryIndex: res.locals.index,
        });
        // データが存在しない場合
      } else {
        const errorMessage = "メモが登録されていません";
        const allShopInfo: string[] = [];

        // レンダリング
        res.render("list.ejs", {
          errorMessage: errorMessage,
          allShopInfo: allShopInfo,
          categoryIndex: res.locals.index,
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
  res.render("createList.ejs", {
    categoryIndex: categoryIndex,
    selectedCategory: selectedCategory,
    shopName: "",
    shopLocation: "",
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

  // postされた内容を変数に代入
  const postedShopName = req.body.name;
  const postedShopLocation = req.body.location;
  const postedShopDescription = req.body.description;

  // error文格納用の配列
  const errors: { [key: string]: string } = {};

  // errorチェック
  if (postedShopName === "") {
    errors["shopName"] = "店名・施設名を入力してください";
  }
  if (postedShopLocation === "") {
    errors["shopLocation"] = "場所を入力してください";
  }
  if (postedShopDescription === "") {
    errors["shopDescription"] = "メモを入力してください";
  }

  if (Object.keys(errors).length > 0) {
    res.render("createList.ejs", {
      categoryIndex: categoryIndex,
      selectedCategory: selectedCategory,
      shopName: postedShopName,
      shopLocation: postedShopLocation,
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
  const postedShopLocation = req.body.location;
  const postedShopDescription = req.body.description;

  // error文格納用の配列
  const errors: { [key: string]: string } = {};

  // errorチェック
  if (postedShopName === "") {
    errors["shopName"] = "店名・施設名を入力してください";
  }
  if (postedShopLocation === "") {
    errors["shopLocation"] = "場所を入力してください";
  }
  if (postedShopDescription === "") {
    errors["shopDescription"] = "メモを入力してください";
  }

  if (Object.keys(errors).length > 0) {
    res.render("editList.ejs", {
      selectedCategory: selectedCategory,
      errorMessage: "",
      shopId: selectedShopId,
      shopName: postedShopName,
      shopLocation: postedShopLocation,
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
  // ルートパラメータからcategoryIndexを取得して変数に代入
  const selectedCategoryIndex = req.params.index;
  // getSelectedCategoryメソッドで取得したres.localsの内容を変数に代入
  const selectedCategory = res.locals.selectedCategory;
  // formでpostされた内容を取得
  const createdShopName = req.body.name;
  const createdLocation = req.body.location;
  const createdDescription = req.body.description;

  // postされた内容をuser_favorite_shopsDBに格納
  (async () => {
    const t = await db.UserFavoriteShops.sequelize!.transaction();

    try {
      // createメソッドはbuild+saveを一度に行い、データベースにinsertまで行う
      await db.UserFavoriteShops.create({
        user_id: loginedUserId,
        shop_category: selectedCategory,
        shop_name: createdShopName,
        shop_location: createdLocation,
        shop_description: createdDescription,
      });

      await t?.commit;
    } catch (error) {
      console.log(error);
      await t?.rollback();
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
    const t = await db.UserFavoriteShops.sequelize!.transaction();

    try {
      // Users.createメソッドは下記のbuild+saveを一度に行い、データベースにinsertまで行う
      await db.UserFavoriteShops.destroy({
        where: {
          id: req.params.id,
        },
      });

      await t?.commit;
    } catch (error) {
      console.log(error);
      await t?.rollback();
    }

    // redirect
    const redirectURL = "/list/" + selectedCategoryIndex;
    res.redirect(redirectURL);
  })();
};

// リスト編集画面の表示
export const renderEditListPage = (req: Request, res: Response) => {
  // getSelectedCategoryメソッドで取得したres.localsの内容を変数に代入
  const categoryIndex = res.locals.index;
  const selectedCategory = res.locals.selectedCategory;

  // 選択したリストIdの情報をuser_favorite_shopsDBから取得
  (async () => {
    // user_favorite_shopsDBからデータ取得
    await db.UserFavoriteShops.findAll({
      where: {
        id: req.params.id,
      },
    }).then((data) => {
      // データが存在する場合
      if (data.length !== 0) {
        const errorMessage: string = "";
        const shopInfo: UserFavoriteShops = data[0];
        const shopId = shopInfo.id;
        const shopName = shopInfo.shop_name;
        const shopLocation = shopInfo.shop_location;
        const shopDescription = shopInfo.shop_description;

        // レンダリング
        res.render("editList.ejs", {
          selectedCategory: selectedCategory,
          errorMessage: errorMessage,
          shopId: shopId,
          shopName: shopName,
          shopLocation: shopLocation,
          shopDescription: shopDescription,
          categoryIndex: categoryIndex,
          errors: "",
        });
        // データが存在しない場合
      } else {
        const errorMessage = "情報取得エラー";
        const shopId: any = "";
        const shopName: any = "";
        const shopLocation: any = "";
        const shopDescription: any = "";

        // レンダリング
        res.render("editList.ejs", {
          selectedCategory: selectedCategory,
          errorMessage: errorMessage,
          shopId: shopId,
          shopName: shopName,
          shopLocation: shopLocation,
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
    const t = await db.UserFavoriteShops.sequelize!.transaction();

    try {
      await db.UserFavoriteShops.update(
        {
          shop_name: req.body.name,
          shop_location: req.body.location,
          shop_description: req.body.description,
        },
        { where: { id: selectedShopId } }
      );

      await t?.commit;
    } catch (error) {
      console.log(error);
      await t?.rollback();
    }

    // redirect
    const redirectURL = "/list/" + selectedCategoryIndex;
    res.redirect(redirectURL);
  })();
};
