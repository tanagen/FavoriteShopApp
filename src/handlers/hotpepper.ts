import { Request, Response, NextFunction } from "express";
import fetch from "node-fetch";

interface APIResult {
  name: string;
  urls: {
    pc: string;
  };
}

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
        "5" + // 1: 300m, 2: 500m, 3: 1000m (初期値), 4: 2000m, 5: 3000m
        "&keyword=" +
        keyword +
        "&count=" +
        10 +
        "&format=" +
        "json";

      // hotpepperAPIにフェッチリクエストを送りResultを取得
      const response = await fetch(requestURL);
      const data = await response.text();
      const json = JSON.parse(data);

      // APIResultにshopデータが存在する場合
      if (json.results.shop.length !== 0) {
        // 店名とHotPepperURLの配列を作成
        let shopNames: [] = json.results.shop.map(
          (shopInfo: APIResult) => shopInfo.name
        );
        let shopURLs: [] = json.results.shop.map(
          (shopInfo: APIResult) => shopInfo.urls.pc
        );

        // 各配列をzip関数でまとめる
        const shops: string[][] = zip(shopNames, shopURLs);

        // クライアントにレスポンスを送信
        res.json({
          status: "success",
          shops: shops,
        });
      } else {
        // APIResultにshopデータが存在しない場合
        res.json({
          status: "success",
          shops: [["該当データなし"]],
        });
      }
    } else {
      // 検索keywordが入力されていない場合
      res.json({
        status: "success",
        shops: [["検索ワードを入れてください"]],
      });
    }
  } catch (error) {
    console.error("フェッチリクエストエラー", error);
    res.status(500).json({ error: "エラーが発生しました" });
  }
};

// pythonのzip風の関数がjavascriptに無いので自作で関数定義
const zip = (Array1: [], Array2: []) =>
  Array1.map((_: number, i: number) => [Array1[i], Array2[i]]); // アンダーバーのみの変数は、「引数として書く必要はあるため記述はしたが特に使われていない」を示すために使用
