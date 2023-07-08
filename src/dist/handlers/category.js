"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderCategoryPage = void 0;
const index_1 = __importDefault(require("../models/index"));
// loginしたuserのuser_idを変数に格納
const loginedUserId = 1;
const renderCategoryPage = (req, res) => {
    // belongsToのリレーションを持った状態のDBから、loginedUserIdのデータ取り出す
    index_1.default.Users.findAll({
        include: [
            { model: index_1.default.UserFavoriteShops, where: { user_id: loginedUserId } },
        ],
    }).then((loginedUserData) => {
        // user_nameを取得
        const loginedUserName = loginedUserData[0].dataValues.user_name;
        // UserFavoriteShopsテーブルの全データを取得
        const loginedUserFavoriteShops = loginedUserData[0].dataValues.UserFavoriteShops;
        // shop_categoryを配列に格納
        const shopCategories = [];
        loginedUserFavoriteShops.forEach((data) => {
            shopCategories.push(data.shop_category);
        });
        // 重複排除
        const setedShopCategories = Array.from(new Set(shopCategories));
        // category.ejsをレンダリング
        res.render("top.ejs", {
            loginedUserName: [],
            shopCategories: [], // setedShopCategories,
        });
    });
};
exports.renderCategoryPage = renderCategoryPage;
