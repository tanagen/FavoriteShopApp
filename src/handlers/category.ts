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

export const getAllCategories = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // ログインユーザーのIDをpassportのsessionから取得
  const loginedUserId: number = req.user!.id;

  // DBからデータを取得
  (async () => {
    await db.ShopCategories.findAll({
      where: { user_id: loginedUserId },
    }).then((allData) => {
      // ID,カテゴリー名を取得して配列に格納
      const CategoryIDs: number[] = [];
      const Categories: string[] = [];

      allData.forEach((data) => {
        CategoryIDs.push(Number(data.dataValues.id));
        Categories.push(data.dataValues.shop_category);
      });

      // res.localに格納
      res.locals.shopCategoryIds = CategoryIDs;
      res.locals.shopCategories = Categories;

      next();
    });
  })();
};

export const renderCategoryPage = (req: Request, res: Response) => {
  // ログインユーザーの名前をpassportのsessionから取得
  const loginedUserName: string = req.user!.user_name;

  // getShopCategoriesメソッドからres.localsを取得
  const userShopCategories = res.locals.shopCategories;

  res.render("category", {
    loginedUserName: loginedUserName,
    shopCategories: userShopCategories,
  });
};

export const renderCreateCategoryPage = (req: Request, res: Response) => {
  res.render("createCategory", { errors: {}, category: "" });
};

export const renderEditCategoryPage = (req: Request, res: Response) => {
  // getSelectedCategoryメソッドからインデックス番号、カテゴリー名を取得
  const selectedCategoryIndex = res.locals.index;
  const selectedCategory = res.locals.selectedCategory;

  res.render("editCategory", {
    errors: {},
    selectedCategoryIndex: selectedCategoryIndex,
    selectedCategory: selectedCategory,
  });
};

export const getDBIdOfUpdatingCategory = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // ログインユーザーのIDをpassportのsessionから取得
  const loginedUserId: number = req.user!.id;
  // getSelectedCategoryメソッドからres.localsを取得
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
    });

    await db.UserMemos.findAll({
      where: { user_id: loginedUserId, shop_category: presentCategory },
    }).then((allData) => {
      const memoDBIDs: number[] = [];
      allData.forEach((data) => {
        memoDBIDs.push(Number(data.dataValues.id));
      });

      // res.localsに格納
      res.locals.targetMemoDBIds = memoDBIDs;

      next();
    });
  })();
};

export const updateCategory = (req: Request, res: Response) => {
  // 更新するカテゴリーのインデックス番号をルートパラメータから取得
  const selectedCategoryIndex = req.params.index;
  // ログインユーザーのIDをpassportのsessionから取得
  const loginedUserId: number = req.user!.id;
  // 更新postされたカテゴリー名を取得
  const updatedCategory = req.body.category;
  // getDBIdOfUpdateCategoryメソッドからres.localsを取得
  const targetCategoryDBId = res.locals.targetCategoryDBId;
  const targetMemoDBIds = res.locals.targetMemoDBIds;

  // shop_categoriesDBとuser_favorite_shopsDBのカテゴリー名をupdate
  (async () => {
    try {
      await db.ShopCategories.update(
        { shop_category: updatedCategory },
        { where: { id: targetCategoryDBId } }
      );

      await db.UserMemos.update(
        { shop_category: updatedCategory },
        { where: { id: targetMemoDBIds } }
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
  // ログインユーザーのIDをpassportのsessionから取得
  const loginedUserId = req.user!.id;
  // 作成postされたカテゴリー名を取得
  const createdCategory = req.body.category;

  // DBに新規登録
  (async () => {
    try {
      await db.ShopCategories.create({
        user_id: loginedUserId,
        shop_category: createdCategory,
      });
    } catch (error) {
      console.log(error);
    } finally {
      res.redirect("/category");
    }
  })();
};

// カテゴリー新規作成時の入力値空チェック&カテゴリー既存チェック
export const checkCreatingCategory = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // getShopCategoriesメソッドからres.localsを取得
  const presentShopCategories: string[] = res.locals.shopCategories;

  // 新規作成postされた値を取得
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

// カテゴリー更新時の入力値空チェック&カテゴリー既存チェック
export const checkUpdatingCategory = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // getShopCategoriesメソッドからres.localsを取得
  const presentShopCategories: string[] = res.locals.shopCategories;

  // 更新postされた値を取得
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
    // getSelectedCategoryメソッドからインデックス番号を取得
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
  // ログインユーザーのIDをpassportのsessionから取得
  const loginedUserId: number = req.user!.id;

  // DBからデータ取得
  (async () => {
    await db.ShopCategories.findAll({
      where: { user_id: loginedUserId },
    }).then((allData) => {
      // 全カテゴリーを取得して配列に格納
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
  // ログインユーザーのIDをpassportのsessionから取得
  const loginedUserId: number = req.user!.id;
  // checkboxでpostされたオブジェクトからkey配列を作成
  const postedCategories: string[] = Object.keys(req.body);

  // 削除postされたカテゴリーをshop_categoriesDBとuser_favorite_shopsDBから削除
  (async () => {
    try {
      await db.ShopCategories.destroy({
        where: { user_id: loginedUserId, shop_category: postedCategories },
      });

      await db.UserMemos.destroy({
        where: { user_id: loginedUserId, shop_category: postedCategories },
      });
    } catch (error) {
      console.log(error);
    }

    res.redirect("/category");
  })();
};
