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
exports.createShopCategory = exports.renderCreateCategoryPage = exports.renderShopCategoryPage = void 0;
const index_1 = __importDefault(require("../models/index"));
// loginしたuserのuser_idを変数に格納
const loginedUserId = 1;
const renderShopCategoryPage = (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const t = yield index_1.default.Users.sequelize.transaction();
        // belongsToのリレーションを持った状態のDBから、loginedUserIdのデータ取り出す
        yield index_1.default.Users.findAll({
            include: [
                { model: index_1.default.ShopCategories, where: { user_id: loginedUserId } },
            ],
        }).then((loginedUserData) => {
            // user_nameを取得
            const loginedUserName = loginedUserData[0].dataValues.user_name;
            // UserFavoriteShopsテーブルの全データを取得
            const loginedUserShopCategories = loginedUserData[0].dataValues.ShopCategories;
            // shop_categoryを配列に格納
            const shopCategories = [];
            loginedUserShopCategories.forEach((data) => {
                shopCategories.push(data.shop_category);
            });
            // 重複排除
            const setedShopCategories = Array.from(new Set(shopCategories));
            // category.ejsをレンダリング
            res.render("category.ejs", {
                loginedUserId: loginedUserId,
                loginedUserName: loginedUserName,
                shopCategories: setedShopCategories,
            });
        });
        yield ((_a = index_1.default.Users.sequelize) === null || _a === void 0 ? void 0 : _a.close());
    }))();
};
exports.renderShopCategoryPage = renderShopCategoryPage;
const renderCreateCategoryPage = (req, res) => {
    res.render("createCategory.ejs", { loginedUserId: loginedUserId });
};
exports.renderCreateCategoryPage = renderCreateCategoryPage;
const createShopCategory = (req, res) => {
    // formでpostされたcateogryを取得
    const createdCategory = req.body.category;
    // 取得したcategoryをshop_categoriesDBに格納
    (() => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const t = yield index_1.default.ShopCategories.sequelize.transaction();
        try {
            // userインスタンス作成
            // Users.createメソッドは下記のbuild+saveを一度に行い、データベースにinsertまで行う
            yield index_1.default.ShopCategories.create({
                user_id: loginedUserId,
                shop_category: createdCategory,
            });
            yield (t === null || t === void 0 ? void 0 : t.commit);
        }
        catch (error) {
            yield (t === null || t === void 0 ? void 0 : t.rollback());
            console.log(error);
        }
        yield ((_a = index_1.default.Users.sequelize) === null || _a === void 0 ? void 0 : _a.close());
    }))();
    // redirect
    console.log("posted!!!");
    const redirectURL = "/category/" + loginedUserId;
    res.redirect(redirectURL);
};
exports.createShopCategory = createShopCategory;
