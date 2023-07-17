import db from "../models/index";
import { Request, Response } from "express";

// sessionに格納したloginedUser情報を変数に格納
const loginedUserId: number = 1;
const loginedUserName: string = "gen";

export const renderShopCategoryPage = (req: Request, res: Response) => {
  (async () => {
    // shop_categoriesDBからデータ取得
    await db.ShopCategories.findAll({
      where: { user_id: loginedUserId },
    }).then((allData) => {
      // // user_nameを取得
      // const loginedUserName: string = loginedUserData[0].dataValues.user_name;
      // // res.localsに代入
      // res.locals.username = loginedUserName;

      // // shopCategoriesテーブルの全データを取得
      // const loginedUserShopCategories: any[] =
      //   loginedUserData[0].dataValues.ShopCategories;

      // 各shop_categoryを配列に格納
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
  res.render("createCategory.ejs", { loginedUserId: loginedUserId });
};

export const createShopCategory = (req: Request, res: Response) => {
  // formでpostされたcateogryを取得
  const createdCategory = req.body.category;

  // 取得したcategoryをshop_categoriesDBに格納
  (async () => {
    const t = await db.ShopCategories.sequelize!.transaction();

    try {
      // userインスタンス作成
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
    // const redirectURL = "/category/" + loginedUserId;
    res.redirect("/category");
  })();
};
