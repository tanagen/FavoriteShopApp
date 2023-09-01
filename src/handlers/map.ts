import path from "path";
import dotenv from "dotenv"; // dotenvモジュールは.envファイルに定義された値を環境変数として使える
const ENV_PATH = path.join(__dirname, "../../../app.env");
dotenv.config({ path: ENV_PATH });

import { Request, Response, NextFunction } from "express";

export const getAPIKey = (req: Request, res: Response, next: NextFunction) => {
  res.locals.apiKey = process.env.GOOGLE_MAPS_API_KEY;

  next();
};

export const showMap = (req: Request, res: Response) => {
  const API_KEY = res.locals.apiKey;
  res.render("map", { apiKey: API_KEY });
};
