import { Request, Response, NextFunction } from "express";
import fetch from "node-fetch";

export const getHotPepperApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.hotpepperApiKey = process.env.HOT_PEPPER_API_KEY;

  next();
};

export const searchFromHotPepper = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //　クライアントから送られたデータを取得
    const keyword = req.body.keyword;
    const lat = req.body.lat;
    const lng = req.body.lng;

    // 検索keywordが入力されている場合
    if (keyword) {
      // クエリリクエストURLを設定
      const hotpepperURL =
        "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=";
      const hotpepperApiKey = process.env.HOT_PEPPER_API_KEY;
      const requestURL =
        hotpepperURL +
        hotpepperApiKey +
        "&lat=" +
        lat +
        "&lng=" +
        lng +
        "&range=" +
        "4" + // 1: 300m, 2: 500m, 3: 1000m (初期値), 4: 2000m, 5: 3000m
        "&keyword=" +
        keyword +
        "&count=" +
        10 +
        "&format=" +
        "json";

      // hotpepperAPIにフェッチリクエストを送り、返されたデータからお店の情報を取得
      const response = await fetch(requestURL);
      const data = await response.text();
      const json = JSON.parse(data);
      console.log(json.results.shop);
      // 店名の配列を作成 (検索結果がない場合は文字)
      let shopNames = json.results.shop.map((shops: any) => shops.name);
      let shopURLs = json.results.shop.map((shops: any) => shops.urls.pc);

      // pythonのzip風の関数がjavascriptに無いので自作関数を定義
      const zip = (Array1: any, Array2: any) =>
        Array1.map((_: any, i: any) => [Array1[i], Array2[i]]);
      const shops = zip(shopNames, shopURLs);

      if (shops.length === 0) {
        shops[0] = "該当データなし";
      }

      // クライアントにレスポンスを送信
      res.json({
        status: "success",
        shops: shops,
      });
    } else {
      // 検索keywordが入力されていない場合
      res.json({
        status: "success",
        shops: [["検索ワードを入れてください"]],
      });
    }
  } catch (error) {
    console.error("hotpepperAPIへのフェッチリクエストエラー", error);
    res.status(500).json({ error: "エラーが発生しました" });
  }
};
