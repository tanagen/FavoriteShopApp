"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchFromHotPepper = exports.getHotPepperApiKey = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const getHotPepperApiKey = (req, res, next) => {
    res.locals.hotpepperApiKey = process.env.HOT_PEPPER_API_KEY;
    next();
};
exports.getHotPepperApiKey = getHotPepperApiKey;
const searchFromHotPepper = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //　クライアントから送られたデータを取得
        const keyword = req.body.keyword;
        const lat = req.body.lat;
        const lng = req.body.lng;
        // 検索keywordが入力されている場合
        if (keyword) {
            // クエリリクエストURLを設定
            const hotpepperURL = "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=";
            const hotpepperApiKey = process.env.HOT_PEPPER_API_KEY;
            const requestURL = hotpepperURL +
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
            // hotpepperAPIにフェッチリクエストを送り、返されたデータからお店の情報を取得
            const response = yield (0, node_fetch_1.default)(requestURL);
            const data = yield response.text();
            const json = JSON.parse(data);
            console.log(json.results.shop);
            // 店名の配列を作成 (検索結果がない場合は文字)
            let shopNames = json.results.shop.map((shops) => shops.name);
            let shopURLs = json.results.shop.map((shops) => shops.urls.pc);
            // pythonのzip風の関数がjavascriptに無いので自作関数を定義
            const zip = (Array1, Array2) => Array1.map((_, i) => [Array1[i], Array2[i]]);
            const shops = zip(shopNames, shopURLs);
            if (shops.length === 0) {
                shops[0] = "該当データなし";
            }
            // クライアントにレスポンスを送信
            res.json({
                status: "success",
                shops: shops,
            });
        }
        else {
            // 検索keywordが入力されていない場合
            res.json({
                status: "success",
                shops: [["検索ワードを入れてください"]],
            });
        }
    }
    catch (error) {
        console.error("hotpepperAPIへのフェッチリクエストエラー", error);
        res.status(500).json({ error: "エラーが発生しました" });
    }
});
exports.searchFromHotPepper = searchFromHotPepper;
