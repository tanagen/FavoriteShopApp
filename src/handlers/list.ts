import db from "../models/index";
import { Request, Response, NextFunction } from "express";
import UserFavoriteShops from "../models/userFavoriteShops";

// sessionに格納したloginedUser情報を変数に格納
const loginedUserId: number = 1;
const loginedUserName: string = "gen";

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

export const renderCreateListPage = (req: Request, res: Response) => {
  const categoryIndex = res.locals.index;
  const selectedCategory = res.locals.selectedCategory;
  res.render("createList.ejs", {
    categoryIndex: categoryIndex,
    selectedCategory: selectedCategory,
  });
};
