"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showMap = exports.getAPIKey = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv")); // dotenvモジュールは.envファイルに定義された値を環境変数として使える
const ENV_PATH = path_1.default.join(__dirname, "../../../app.env");
dotenv_1.default.config({ path: ENV_PATH });
const getAPIKey = (req, res, next) => {
    // app.envファイルからAPI_KEYの環境変数を取得
    res.locals.apiKey = process.env.GOOGLE_MAPS_API_KEY;
    next();
};
exports.getAPIKey = getAPIKey;
// export const getLatLng = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {};
const showMap = (req, res) => {
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
exports.showMap = showMap;
// export const saveCoordinate = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { lat, lng } = req.body;
//   console.log(`サーバー側：${lat} ${lng}`);
//   res.locals.lat = lat;
//   res.locals.lng = lng;
//   res.sendStatus(200); // 成功を返す
//   // next();
// };
