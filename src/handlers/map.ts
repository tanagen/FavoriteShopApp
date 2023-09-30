import { Request, Response, NextFunction } from "express";

export const getGoogleMapsApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // app.envファイルからAPI_KEYの環境変数を取得
  res.locals.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

  next();
};

export const showMap = (req: Request, res: Response) => {
  // getGoogleMapsApiKeyメソッドからres.localsを取得
  const googleMapsApiKey = res.locals.googleMapsApiKey;
  // getSelectedCategoryメソッドからres.localsを取得
  const selectedCategoryIndex = res.locals.index;
  const selectedCategory = res.locals.selectedCategory;
  // getSelectedMemoメソッドからres.lcoalsを取得
  const selectedMemo = res.locals.selectedMemo;
  const errorMessage = res.locals.errorMessage;

  res.render("map", {
    googleMapsApiKey: googleMapsApiKey,
    selectedCategoryIndex: selectedCategoryIndex,
    selectedCategory: selectedCategory,
    selectedMemo: selectedMemo,
    errorMessage: errorMessage,
  });
};
