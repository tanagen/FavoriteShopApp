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
    res.locals.apiKey = process.env.GOOGLE_MAPS_API_KEY;
    next();
};
exports.getAPIKey = getAPIKey;
const showMap = (req, res) => {
    const API_KEY = res.locals.apiKey;
    res.render("map", { apiKey: API_KEY });
};
exports.showMap = showMap;
