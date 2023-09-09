import path from "path";
import dotenv from "dotenv"; // dotenvモジュールは.envファイルに定義された値を環境変数として使える
const ENV_PATH = path.join(__dirname, "../../../app.env");
dotenv.config({ path: ENV_PATH });

import { Request, Response, NextFunction } from "express";

export const getAPIKey = (req: Request, res: Response, next: NextFunction) => {
  // app.envファイルからAPI_KEYの環境変数を取得
  res.locals.apiKey = process.env.GOOGLE_MAPS_API_KEY;

  next();
};

export const showMap = (req: Request, res: Response) => {
  // getAPIKeyメソッドからローカル変数を取得して変数に格納
  const API_KEY = res.locals.apiKey;
  // getSelectedCategoryメソッドで取得したres.localsの内容を変数に代入
  const categoryIndex = res.locals.index;
  const selectedCategory = res.locals.selectedCategory;
  // ルートパラメータから選択したリストIdを取得
  const selectedShopInfo = res.locals.selectedShopInfo;

  res.render("map", {
    apiKey: API_KEY,
    categoryIndex: categoryIndex,
    selectedCategory: selectedCategory,
    shopInfo: selectedShopInfo,
  });
};

export const saveCoordinate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { lat, lng } = req.body;
  console.log(`サーバー側：${lat} ${lng}`);
  res.locals.lat = lat;
  res.locals.lng = lng;

  res.sendStatus(200); // 成功を返す

  // next();
};
