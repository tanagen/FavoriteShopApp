import db from "../models/index";

// loginしたuserのuser_idを変数に格納
const loginedUserId: number = 1;

export const renderCategoryPage = (req: any, res: any) => {
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
    res.render("top.ejs", {
      loginedUserName: [], // loginedUserName,
      shopCategories: [], // setedShopCategories,
    });
  });
};
