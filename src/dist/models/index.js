"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv")); // dotenvモジュールは.envファイルに定義された値を環境変数として使える
const MYSQL_ENV_PATH = path_1.default.join(__dirname, "../../../app.env");
dotenv.config({ path: MYSQL_ENV_PATH.slice(1) }); // pathの設定方法が腑に落ちないが、envファイル名を記載すると正常に読み込んでくれる
const sequelize_1 = require("sequelize");
const users_1 = __importDefault(require("./users"));
const userMemos_1 = __importDefault(require("./userMemos"));
const shopCategories_1 = __importDefault(require("./shopCategories"));
// import { database, username, userpassword } from "../mysqlConfig.js";
// mysql環境変数を取得して変数に格納
const database = process.env.MYSQL_DATABASE;
const username = process.env.MYSQL_USER;
const userpassword = process.env.MYSQL_PASSWORD;
// console.log(database, username, userpassword);
// console.log(process.env);
// sequelizeインスタンスの作成
const sequelize = new sequelize_1.Sequelize(database, username, userpassword, {
    host: "mysql",
    dialect: "mysql", //ここはmysql固定
});
// モデルを一つのオブジェクトにまとめる
const db = {
    Users: users_1.default.initialize(sequelize),
    UserMemos: userMemos_1.default.initialize(sequelize),
    ShopCategories: shopCategories_1.default.initialize(sequelize),
};
// テーブル同士の関係を作成する
Object.keys(db).forEach((tableName) => {
    if (tableName === "Users" ||
        tableName === "UserMemos" ||
        tableName === "ShopCategories") {
        const model = db[tableName];
        if (model.associate) {
            model.associate();
        }
    }
});
exports.default = db;
