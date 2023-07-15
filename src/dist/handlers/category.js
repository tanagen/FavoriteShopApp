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
// sessionに格納したloginedUser情報を変数に格納
const loginedUserId = 1;
const loginedUserName = "gen";
const renderShopCategoryPage = (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        // shop_categoriesDBからデータ取得
        yield index_1.default.ShopCategories.findAll({
            where: { user_id: loginedUserId },
        }).then((allData) => {
            // // user_nameを取得
            // const loginedUserName: string = loginedUserData[0].dataValues.user_name;
            // // res.localsに代入
            // res.locals.username = loginedUserName;
            // // shopCategoriesテーブルの全データを取得
            // const loginedUserShopCategories: any[] =
            //   loginedUserData[0].dataValues.ShopCategories;
            // 各shop_categoryを配列に格納
            const shopCategories = [];
            allData.forEach((data) => {
                shopCategories.push(data.dataValues.shop_category);
            });
            // 重複排除
            const setedShopCategories = Array.from(new Set(shopCategories));
            // category.ejsをレンダリング
            res.render("category.ejs", {
                // loginedUserId: loginedUserId,
                loginedUserName: loginedUserName,
                shopCategories: setedShopCategories,
            });
        });
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
            console.log(error);
            yield (t === null || t === void 0 ? void 0 : t.rollback());
        }
        // redirect
        // const redirectURL = "/category/" + loginedUserId;
        res.redirect("/category");
    }))();
};
exports.createShopCategory = createShopCategory;
