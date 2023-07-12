import db from "../models/index";
import { Request, Response } from "express";

// loginしたuserのuser_idを変数に格納
const loginedUserId: number = 1;

export const renderCategoryPage = (req: Request, res: Response) => {
  // belongsToのリレーションを持った状態のDBから、loginedUserIdのデータ取り出す
  db.Users.findAll({
    include: [
      { model: db.UserFavoriteShops, where: { user_id: loginedUserId } },
    ],
  }).then((loginedUserData) => {
    // user_nameを取得
    const loginedUserName: string = loginedUserData[0].dataValues.user_name;

    // UserFavoriteShopsテーブルの全データを取得
    const loginedUserFavoriteShops: any[] =
      loginedUserData[0].dataValues.UserFavoriteShops;

    // shop_categoryを配列に格納
    const shopCategories: string[] = [];
    loginedUserFavoriteShops.forEach((data) => {
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
};

export const renderCreateCategoryPage = (req: Request, res: Response) => {
  res.render("createCategory.ejs", { loginedUserId: loginedUserId });
};

export const createCategory = (req: Request, res: Response) => {
  // formでpostされたcateogryを取得
  const createdCategory = req.body.category;

  // 取得したcategoryをsessionに格納？

  // redirect
  console.log("posted!!!");
  const redirectURL = "/category/" + loginedUserId;
  res.redirect(redirectURL);
};
