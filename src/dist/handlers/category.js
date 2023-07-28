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
exports.deleteCategory = exports.renderDeleteCategoryPage = exports.checkPostedNewCategory = exports.createShopCategory = exports.renderCreateCategoryPage = exports.renderShopCategoryPage = exports.getShopCategories = void 0;
const index_1 = __importDefault(require("../models/index"));
const getShopCategories = (req, res, next) => {
    // passportのsessionからid,user_nameを取得
    const loginedUserId = req.user.id;
    (() => __awaiter(void 0, void 0, void 0, function* () {
        // shop_categoriesDBからデータ取得
        yield index_1.default.ShopCategories.findAll({
            where: { user_id: loginedUserId },
        }).then((allData) => {
            // allDataから各shop_categoryを取得して配列に格納
            const shopCategories = [];
            allData.forEach((data) => {
                shopCategories.push(data.dataValues.shop_category);
            });
            // 重複排除
            const setedShopCategories = Array.from(new Set(shopCategories));
            // res.localに格納
            res.locals.shopCategories = setedShopCategories;
            next();
        });
    }))();
};
exports.getShopCategories = getShopCategories;
const renderShopCategoryPage = (req, res) => {
    // passportのsessionからid,user_nameを取得
    // const loginedUserId: number = req.user!.id;
    const loginedUserName = req.user.user_name;
    // getShopCategoriesメソッドで取得したres.localsの内容を取得して変数に代入
    const userShopCategories = res.locals.shopCategories;
    // (async () => {
    //   // shop_categoriesDBからデータ取得
    //   await db.ShopCategories.findAll({
    //     where: { user_id: loginedUserId },
    //   }).then((allData) => {
    //     // allDataから各shop_categoryを取得して配列に格納
    //     const shopCategories: string[] = [];
    //     allData.forEach((data) => {
    //       shopCategories.push(data.dataValues.shop_category);
    //     });
    //     // 重複排除
    //     const setedShopCategories: string[] = Array.from(new Set(shopCategories));
    //   });
    // })();
    // category.ejsをレンダリング
    res.render("category", {
        loginedUserName: loginedUserName,
        shopCategories: userShopCategories,
    });
};
exports.renderShopCategoryPage = renderShopCategoryPage;
const renderCreateCategoryPage = (req, res) => {
    // const loginedUserId: number = req.user!.id;
    res.render("createCategory", { errors: {} }); // { loginedUserId: loginedUserId }
};
exports.renderCreateCategoryPage = renderCreateCategoryPage;
const createShopCategory = (req, res) => {
    const loginedUserId = req.user.id;
    // formでpostされたcateogryを取得
    const createdCategory = req.body.category;
    // 取得したcategoryをshop_categoriesDBに格納
    (() => __awaiter(void 0, void 0, void 0, function* () {
        // const t = await db.ShopCategories.sequelize!.transaction();
        try {
            yield index_1.default.ShopCategories.create({
                user_id: loginedUserId,
                shop_category: createdCategory,
            });
            // await t?.commit;
        }
        catch (error) {
            console.log(error);
            // await t?.rollback();
        }
        // redirect
        res.redirect("/category");
    }))();
};
exports.createShopCategory = createShopCategory;
// カテゴリー新規登録における入力値の空チェック&既存カテゴリーチェック
const checkPostedNewCategory = (req, res, next) => {
    // getShopCategoriesメソッドで取得したres.localsの内容を取得して変数に代入
    const presentShopCategories = res.locals.shopCategories;
    // postされた値を取得して変数に代入
    const postedCategory = req.body.category;
    // error文格納用の配列
    const errors = {};
    // errorチェック
    if (postedCategory === "") {
        errors["category"] = "入力してください";
    }
    if (presentShopCategories.includes(postedCategory) === true) {
        errors["duplication"] = "既に登録されたカテゴリーです";
    }
    if (Object.keys(errors).length > 0) {
        res.render("createCategory", {
            errors: errors,
        });
    }
    else {
        next();
    }
};
exports.checkPostedNewCategory = checkPostedNewCategory;
const renderDeleteCategoryPage = (req, res) => {
    // passportのsessionからid,user_nameを取得
    const loginedUserId = req.user.id;
    (() => __awaiter(void 0, void 0, void 0, function* () {
        // shop_categoriesDBからデータ取得
        yield index_1.default.ShopCategories.findAll({
            where: { user_id: loginedUserId },
        }).then((allData) => {
            // allDataから各shop_categoryを取得して配列に格納
            const shopCategories = [];
            allData.forEach((data) => {
                shopCategories.push(data.dataValues.shop_category);
            });
            // 重複排除
            const setedShopCategories = Array.from(new Set(shopCategories));
            // レンダリング
            res.render("deleteCategory", { shopCategories: setedShopCategories });
        });
    }))();
};
exports.renderDeleteCategoryPage = renderDeleteCategoryPage;
const deleteCategory = (req, res) => {
    // sessionからid,user_nameを取得
    const loginedUserId = req.user.id;
    // checkboxからpostされたオブジェクトからkeyの配列を作成
    const postedCategories = Object.keys(req.body);
    // postされたcategoryをshop_categoriesDBとuser_favorite_shopsDBから削除
    (() => __awaiter(void 0, void 0, void 0, function* () {
        // const t = await db.ShopCategories.sequelize!.transaction();
        try {
            yield index_1.default.ShopCategories.destroy({
                where: { user_id: loginedUserId, shop_category: postedCategories },
            });
            yield index_1.default.UserFavoriteShops.destroy({
                where: { user_id: loginedUserId, shop_category: postedCategories },
            });
            // await t.commit;
        }
        catch (error) {
            console.log(error);
            // await t.rollback();
        }
        // redirect
        res.redirect("/category");
    }))();
};
exports.deleteCategory = deleteCategory;
