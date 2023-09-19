// 環境変数の更新を行いたい場合は、以下のコメントアウトを解除してリロードする
// import * as dotenv from "dotenv"; // dotenvモジュールは.envファイルに定義された値を環境変数として使え
// import path from "path";
// const APP_ENV_PATH = path.resolve(__dirname, "../../../app.env");
// dotenv.config({ path: APP_ENV_PATH.slice(1) }); // pathの設定方法が腑に落ちないが、envファイル名を記載すると正常に読み込んでくれる
// console.log(process.env);

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
  // getSelectedListメソッドで取得したres.lcoalsを変数に代入
  const selectedShopInfo = res.locals.selectedShopInfo;
  const errorMessage = res.locals.errorMessage;

  res.render("map", {
    apiKey: API_KEY,
    categoryIndex: categoryIndex,
    selectedCategory: selectedCategory,
    shopInfo: selectedShopInfo,
    errorMessage: errorMessage,
  });
};
