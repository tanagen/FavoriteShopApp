import db from "../models/index";
import { Request, Response } from "express";

// loginしたuserのuser_idを変数に格納
const loginedUserId: number = 1;

export const renderShopCategoryPage = (req: Request, res: Response) => {
  (async () => {
    const t = await db.Users.sequelize!.transaction();
    // belongsToのリレーションを持った状態のDBから、loginedUserIdのデータ取り出す
    await db.Users.findAll({
      include: [
        { model: db.ShopCategories, where: { user_id: loginedUserId } },
      ],
    }).then((loginedUserData) => {
      // user_nameを取得
      const loginedUserName: string = loginedUserData[0].dataValues.user_name;

      // UserFavoriteShopsテーブルの全データを取得
      const loginedUserShopCategories: any[] =
        loginedUserData[0].dataValues.ShopCategories;

      // shop_categoryを配列に格納
      const shopCategories: string[] = [];
      loginedUserShopCategories.forEach((data) => {
        shopCategories.push(data.shop_category);
      });
      // 重複排除
      const setedShopCategories: string[] = Array.from(new Set(shopCategories));

      // category.ejsをレンダリング
      res.render("category.ejs", {
        loginedUserId: loginedUserId,
        loginedUserName: loginedUserName,
        shopCategories: setedShopCategories,
      });
    });
    await db.Users.sequelize?.close();
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
      await t?.rollback();
      console.log(error);
    }

    await db.Users.sequelize?.close();
  })();

  // redirect
  console.log("posted!!!");
  const redirectURL = "/category/" + loginedUserId;
  res.redirect(redirectURL);
};
