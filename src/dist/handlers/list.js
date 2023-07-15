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
exports.renderCreateListPage = exports.renderListPage = exports.getSelectedCategory = void 0;
const index_1 = __importDefault(require("../models/index"));
// sessionに格納したloginedUser情報を変数に格納
const loginedUserId = 1;
const loginedUserName = "gen";
const getSelectedCategory = (req, res, next) => {
    // ルートパラメータからカテゴリーのインデックス番号を取得
    const categoryIndex = Number(req.params.index);
    res.locals.index = categoryIndex;
    (() => __awaiter(void 0, void 0, void 0, function* () {
        // shop_categoriesDBからデータ取得
        yield index_1.default.ShopCategories.findAll({
            where: { user_id: loginedUserId },
        }).then((allData) => {
            // shop_categoryを配列に格納
            const shopCategories = [];
            allData.forEach((data) => {
                shopCategories.push(data.dataValues.shop_category);
            });
            // 重複排除
            const setedShopCategories = Array.from(new Set(shopCategories));
            // ルートパラメータで渡されたcategoryIndexのカテゴリー名をres.localsに格納
            res.locals.selectedCategory = setedShopCategories[categoryIndex];
            next();
        });
    }))();
};
exports.getSelectedCategory = getSelectedCategory;
const renderListPage = (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        // user_favorite_shopsDBからデータ取得
        yield index_1.default.UserFavoriteShops.findAll({
            where: {
                user_id: loginedUserId,
                shop_category: res.locals.selectedCategory,
            },
        }).then((data) => {
            // データが存在する場合
            if (data.length !== 0) {
                const errorMessage = "";
                const allShopInfo = data;
                // レンダリング
                res.render("list.ejs", {
                    errorMessage: errorMessage,
                    allShopInfo: allShopInfo,
                    categoryIndex: res.locals.index,
                });
                // データが存在しない場合
            }
            else {
                const errorMessage = "メモが登録されていません";
                const allShopInfo = [];
                // レンダリング
                res.render("list.ejs", {
                    errorMessage: errorMessage,
                    allShopInfo: allShopInfo,
                    categoryIndex: res.locals.index,
                });
            }
        });
    }))();
};
exports.renderListPage = renderListPage;
const renderCreateListPage = (req, res) => {
    const categoryIndex = res.locals.index;
    const selectedCategory = res.locals.selectedCategory;
    res.render("createList.ejs", {
        categoryIndex: categoryIndex,
        selectedCategory: selectedCategory,
    });
};
exports.renderCreateListPage = renderCreateListPage;
