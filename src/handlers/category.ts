import db from "../models/index";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface User {
      id: number;
      user_name: string;
    }
  }
}

export const getInfoOfCategories = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // passportのsessionからid,user_nameを取得
  const loginedUserId: number = req.user!.id;

  (async () => {
    // shop_categoriesDBからデータ取得
    await db.ShopCategories.findAll({
      where: { user_id: loginedUserId },
    }).then((allData) => {
      // allDataからid,shop_categoryを取得してそれぞれ配列に格納
      const shopCategoryIds: number[] = [];
      const shopCategories: string[] = [];

      allData.forEach((data) => {
        shopCategoryIds.push(Number(data.dataValues.id));
        shopCategories.push(data.dataValues.shop_category);
      });

      // 重複排除
      // const setedShopCategories: string[] = Array.from(new Set(shopCategories));
      // res.localに格納
      res.locals.shopCategoryIds = shopCategoryIds;
      res.locals.shopCategories = shopCategories;

      next();
    });
  })();
};

export const renderCategoryPage = (req: Request, res: Response) => {
  // passportのsessionからid,user_nameを取得
  // const loginedUserId: number = req.user!.id;
  const loginedUserName: string = req.user!.user_name;

  // getShopCategoriesメソッドで取得したres.localsの内容を取得して変数に代入
  const userShopCategories = res.locals.shopCategories;

  // (async () => {
  //   // shop_categoriesDBからデータ取得
  //   await db.ShopCategories.findAll({
  //     where: { user_id: loginedUserId },
  //   }).then((allData) => {
  //     // allDataから各shop_categoryを取得して配列に格納
  //     const shopCategories: string[] = [];
  //     allData.forEach((data) => {
  //       shopCategories.push(data.dataValues.shop_category);
  //     });

  //     // 重複排除
  //     const setedShopCategories: string[] = Array.from(new Set(shopCategories));

  //   });
  // })();

  // category.ejsをレンダリング
  res.render("category", {
    loginedUserName: loginedUserName,
    shopCategories: userShopCategories,
  });
};

export const renderCreateCategoryPage = (req: Request, res: Response) => {
  // const loginedUserId: number = req.user!.id;
  res.render("createCategory", { errors: {}, category: "" });
};

export const renderEditCategoryPage = (req: Request, res: Response) => {
  // getSelectedCategoryメソッドで取得したindex, category名を変数に格納
  const selectedCategoryIndex = res.locals.index;
  const selectedCategory = res.locals.selectedCategory;

  res.render("editCategory", {
    errors: {},
    selectedCategoryIndex: selectedCategoryIndex,
    selectedCategory: selectedCategory,
  });
};

export const getDBIdOfUpdateCategory = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // passportのsessionからuserIdを取得
  const loginedUserId: number = req.user!.id;
  // getSelectedCategoryメソッドで取得したres.localsの内容を変数に代入
  const selectedCategoryIndex = res.locals.index;
  const presentCategory = res.locals.selectedCategory;

  // shop_categoriesDBとuser_favorite_shopsDBから更新対象のDBidを取得して配列に格納
  (async () => {
    await db.ShopCategories.findAll({
      where: { user_id: loginedUserId },
    }).then((allData) => {
      const shopCategoryDBIds: number[] = [];
      const shopCategories: string[] = [];

      allData.forEach((data) => {
        shopCategoryDBIds.push(Number(data.dataValues.id));
        shopCategories.push(data.dataValues.shop_category);
      });

      // res.localsに格納
      res.locals.targetCategoryDBId = shopCategoryDBIds[selectedCategoryIndex];
      // res.locals.presentCategory = shopCategories[selectedCategoryIndex];
    });

    await db.UserFavoriteShops.findAll({
      where: { user_id: loginedUserId, shop_category: presentCategory },
    }).then((allData) => {
      const userFavoriteShopDBIds: number[] = [];
      allData.forEach((data) => {
        userFavoriteShopDBIds.push(Number(data.dataValues.id));
      });

      // res.localsに格納
      res.locals.targetUserFavoriteShopDBIds = userFavoriteShopDBIds;

      next();
    });
  })();
};

export const updateCategory = (req: Request, res: Response) => {
  // postURLのルートパラメータからselectedCategoryIndexを取得して変数に格納
  const selectedCategoryIndex = req.params.index;
  // passportのsessionからuserIdを取得
  const loginedUserId: number = req.user!.id;
  // 更新postされたカテゴリー名を変数に格納
  const updatedCategory = req.body.category;
  // getDBIdOfUpdateCategoryメソッドで取得したres.localsの内容を変数に格納
  const targetCategoryDBId = res.locals.targetCategoryDBId;
  const targetUserFavoriteShopDBIds = res.locals.targetUserFavoriteShopDBIds;

  // shop_categoriesDBとuser_favorite_shopsDBのカテゴリー名をupdate
  (async () => {
    try {
      await db.ShopCategories.update(
        { shop_category: updatedCategory },
        { where: { id: targetCategoryDBId } }
      );

      await db.UserFavoriteShops.update(
        { shop_category: updatedCategory },
        { where: { id: targetUserFavoriteShopDBIds } }
      );
    } catch (error) {
      console.log(error);
    } finally {
      // redirect
      const redirectURL = "/memo/" + selectedCategoryIndex;
      res.redirect(redirectURL);
    }
  })();
};

export const createCategory = (req: Request, res: Response) => {
  const loginedUserId: number = req.user!.id;
  // formでpostされたcateogryを取得
  const createdCategory = req.body.category;

  // 取得したcategoryをshop_categoriesDBに格納
  (async () => {
    try {
      await db.ShopCategories.create({
        user_id: loginedUserId,
        shop_category: createdCategory,
      });
    } catch (error) {
      console.log(error);
    } finally {
      // redirect
      res.redirect("/category");
    }
  })();
};

// カテゴリー新規登録における入力値の空チェック&既存カテゴリーチェック
export const checkCreatingCategory = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // getShopCategoriesメソッドで取得したres.localsの内容を取得して変数に代入
  const presentShopCategories: string[] = res.locals.shopCategories;

  // postされた値を取得して変数に代入
  const postedCategory = req.body.category;

  // error文格納用の配列
  const errors: { [key: string]: string } = {};

  // errorチェック
  if (postedCategory === "") {
    errors["category"] = "入力してください";
  }
  if (presentShopCategories.includes(postedCategory)) {
    errors["duplication"] = "既に登録されたカテゴリーです";
  }

  if (Object.keys(errors).length > 0) {
    res.render("createCategory", {
      errors: errors,
      category: postedCategory,
    });
  } else {
    next();
  }
};

// カテゴリー更新における入力値の空チェック&既存カテゴリーチェック
export const checkUpdatingCategory = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // getShopCategoriesメソッドで取得したres.localsの内容を取得して変数に代入
  const presentShopCategories: string[] = res.locals.shopCategories;

  // postされた値を取得して変数に代入
  const postedCategory = req.body.category;

  // error文格納用の配列
  const errors: { [key: string]: string } = {};

  // errorチェック
  if (postedCategory === "") {
    errors["category"] = "入力してください";
  }
  if (presentShopCategories.includes(postedCategory)) {
    errors["duplication"] = "既に登録されたカテゴリーです";
  }

  if (Object.keys(errors).length > 0) {
    // getSelectedCategoryメソッドで取得したindexを変数に格納
    const selectedCategoryIndex = res.locals.index;

    res.render("editCategory", {
      errors: errors,
      selectedCategoryIndex: selectedCategoryIndex,
      selectedCategory: postedCategory,
    });
  } else {
    next();
  }
};

export const renderDeleteCategoryPage = (req: Request, res: Response) => {
  // passportのsessionからid,user_nameを取得
  const loginedUserId: number = req.user!.id;

  (async () => {
    // shop_categoriesDBからデータ取得
    await db.ShopCategories.findAll({
      where: { user_id: loginedUserId },
    }).then((allData) => {
      // allDataから各shop_categoryを取得して配列に格納
      const shopCategories: string[] = [];
      allData.forEach((data) => {
        shopCategories.push(data.dataValues.shop_category);
      });

      // 重複排除
      const setedShopCategories: string[] = Array.from(new Set(shopCategories));

      // レンダリング
      res.render("deleteCategory", { shopCategories: setedShopCategories });
    });
  })();
};

export const deleteCategory = (req: Request, res: Response) => {
  // sessionからid,user_nameを取得
  const loginedUserId: number = req.user!.id;
  // checkboxからpostされたオブジェクトからkeyの配列を作成
  const postedCategories: string[] = Object.keys(req.body);

  // postされたcategoryをshop_categoriesDBとuser_favorite_shopsDBから削除
  (async () => {
    // const t = await db.ShopCategories.sequelize!.transaction();

    try {
      await db.ShopCategories.destroy({
        where: { user_id: loginedUserId, shop_category: postedCategories },
      });

      await db.UserFavoriteShops.destroy({
        where: { user_id: loginedUserId, shop_category: postedCategories },
      });

      // await t.commit;
    } catch (error) {
      console.log(error);
      // await t.rollback();
    }

    // redirect
    res.redirect("/category");
  })();
};
