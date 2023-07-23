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

export const renderShopCategoryPage = (req: Request, res: Response) => {
  console.log(req.user);
  // passportのsessionからid,user_nameを取得
  const loginedUserId: number = req.user!.id;
  const loginedUserName: string = req.user!.user_name;

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

      // category.ejsをレンダリング
      res.render("category", {
        // loginedUserId: loginedUserId,
        loginedUserName: loginedUserName,
        shopCategories: setedShopCategories,
      });
    });
  })();
};

export const renderCreateCategoryPage = (req: Request, res: Response) => {
  const loginedUserId: number = req.user!.id;
  res.render("createCategory", { errors: {} }); // { loginedUserId: loginedUserId }
};

export const createShopCategory = (req: Request, res: Response) => {
  const loginedUserId: number = req.user!.id;
  // formでpostされたcateogryを取得
  const createdCategory = req.body.category;

  // 取得したcategoryをshop_categoriesDBに格納
  (async () => {
    const t = await db.ShopCategories.sequelize!.transaction();

    try {
      // Users.createメソッドは下記のbuild+saveを一度に行い、データベースにinsertまで行う
      await db.ShopCategories.create({
        user_id: loginedUserId,
        shop_category: createdCategory,
      });

      await t?.commit;
    } catch (error) {
      console.log(error);
      await t?.rollback();
    }

    // redirect
    res.redirect("/category");
  })();
};

// カテゴリー新規登録における入力値の空チェック
export const checkPostedNewCategory = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // postされた内容を変数に代入
  const postedCategory = req.body.category;

  // error文格納用の配列
  const errors: { [key: string]: string } = {};

  // errorチェック
  if (postedCategory === "") {
    errors["category"] = "入力してください";
  }

  if (Object.keys(errors).length > 0) {
    res.render("createCategory", {
      errors: errors,
    });
  } else {
    next();
  }
};
