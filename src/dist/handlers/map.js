"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAPIKey = exports.showMap = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv")); // dotenvモジュールは.envファイルに定義された値を環境変数として使える
const ENV_PATH = path_1.default.join(__dirname, "../../../app.env");
dotenv_1.default.config({ path: ENV_PATH });
const showMap = (req, res) => {
    res.render("map");
};
exports.showMap = showMap;
const getAPIKey = (req, res, next) => {
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    console.log(API_KEY);
    next();
};
exports.getAPIKey = getAPIKey;
