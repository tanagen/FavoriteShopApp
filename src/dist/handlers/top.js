"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTopPage = void 0;
const index_1 = __importDefault(require("../models/index"));
const renderTopPage = (req, res) => {
    // UserFavoriteShopsデータベースのshop_categoryデータを取得
    index_1.default.UserFavoriteShops.findAll({ attributes: ["shop_category"] }).then((data) => {
        // 取得データ(オブジェクト)の値を配列に格納した後に、重複を削除
        const dataValues = [];
        data.forEach((dataValue) => {
            dataValues.push(dataValue.shop_category);
        });
        const setedDataValues = Array.from(new Set(dataValues));
        // top.ejsをレンダリング
        res.render("top.ejs", { shopCategories: setedDataValues });
    });
};
exports.renderTopPage = renderTopPage;
