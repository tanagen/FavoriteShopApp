"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const users_1 = __importDefault(require("./users"));
const userFavoriteShops_1 = __importDefault(require("./userFavoriteShops"));
const shopCategories_1 = __importDefault(require("./shopCategories"));
const mysqlConfig_js_1 = require("../mysqlConfig.js");
console.log(mysqlConfig_js_1.host);
// sequelizeインスタンスの作成
const sequelize = new sequelize_1.Sequelize(mysqlConfig_js_1.database, mysqlConfig_js_1.username, mysqlConfig_js_1.userpassword, {
    host: mysqlConfig_js_1.host,
    dialect: mysqlConfig_js_1.dialect,
});
// モデルを一つのオブジェクトにまとめる
const db = {
    Users: users_1.default.initialize(sequelize),
    UserFavoriteShops: userFavoriteShops_1.default.initialize(sequelize),
    ShopCategories: shopCategories_1.default.initialize(sequelize),
};
// テーブル同士の関係を作成する
Object.keys(db).forEach((tableName) => {
    if (tableName === "Users" ||
        tableName === "UserFavoriteShops" ||
        tableName === "ShopCategories") {
        const model = db[tableName];
        if (model.associate) {
            model.associate();
        }
    }
});
exports.default = db;
