import models from "../models";
import db from "../models/index";

export const renderTopPage = (req: any, res: any) => {
  // UserFavoriteShopsデータベースのshop_categoryデータを取得
  db.UserFavoriteShops.findAll({ attributes: ["shop_category"] }).then(
    (data) => {
      // 取得データ(オブジェクト)の値を配列に格納した後に、重複を削除
      const dataValues: string[] = [];
      data.forEach((dataValue) => {
        dataValues.push(dataValue.shop_category);
      });
      const setedDataValues: string[] = Array.from(new Set(dataValues));

      // top.ejsをレンダリング
      res.render("top.ejs", { shopCategories: setedDataValues });
    }
  );
};
