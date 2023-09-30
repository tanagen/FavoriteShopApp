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
exports.deleteCategory = exports.renderDeleteCategoryPage = exports.checkUpdatingCategory = exports.checkCreatingCategory = exports.createCategory = exports.updateCategory = exports.getDBIdOfUpdatingCategory = exports.renderEditCategoryPage = exports.renderCreateCategoryPage = exports.renderCategoryPage = exports.getAllCategories = void 0;
const index_1 = __importDefault(require("../models/index"));
const getAllCategories = (req, res, next) => {
    // ログインユーザーのIDをpassportのsessionから取得
    const loginedUserId = req.user.id;
    // DBからデータを取得
    (() => __awaiter(void 0, void 0, void 0, function* () {
        yield index_1.default.ShopCategories.findAll({
            where: { user_id: loginedUserId },
        }).then((allData) => {
            // ID,カテゴリー名を取得して配列に格納
            const CategoryIDs = [];
            const Categories = [];
            allData.forEach((data) => {
                CategoryIDs.push(Number(data.dataValues.id));
                Categories.push(data.dataValues.shop_category);
            });
            // res.localに格納
            res.locals.shopCategoryIds = CategoryIDs;
            res.locals.shopCategories = Categories;
            next();
        });
    }))();
};
exports.getAllCategories = getAllCategories;
const renderCategoryPage = (req, res) => {
    // ログインユーザーの名前をpassportのsessionから取得
    const loginedUserName = req.user.user_name;
    // getShopCategoriesメソッドからres.localsを取得
    const userShopCategories = res.locals.shopCategories;
    res.render("category", {
        loginedUserName: loginedUserName,
        shopCategories: userShopCategories,
    });
};
exports.renderCategoryPage = renderCategoryPage;
const renderCreateCategoryPage = (req, res) => {
    res.render("createCategory", { errors: {}, category: "" });
};
exports.renderCreateCategoryPage = renderCreateCategoryPage;
const renderEditCategoryPage = (req, res) => {
    // getSelectedCategoryメソッドからインデックス番号、カテゴリー名を取得
    const selectedCategoryIndex = res.locals.index;
    const selectedCategory = res.locals.selectedCategory;
    res.render("editCategory", {
        errors: {},
        selectedCategoryIndex: selectedCategoryIndex,
        selectedCategory: selectedCategory,
    });
};
exports.renderEditCategoryPage = renderEditCategoryPage;
const getDBIdOfUpdatingCategory = (req, res, next) => {
    // ログインユーザーのIDをpassportのsessionから取得
    const loginedUserId = req.user.id;
    // getSelectedCategoryメソッドからres.localsを取得
    const selectedCategoryIndex = res.locals.index;
    const presentCategory = res.locals.selectedCategory;
    // shop_categoriesDBとuser_favorite_shopsDBから更新対象のDBidを取得して配列に格納
    (() => __awaiter(void 0, void 0, void 0, function* () {
        yield index_1.default.ShopCategories.findAll({
            where: { user_id: loginedUserId },
        }).then((allData) => {
            const shopCategoryDBIds = [];
            const shopCategories = [];
            allData.forEach((data) => {
                shopCategoryDBIds.push(Number(data.dataValues.id));
                shopCategories.push(data.dataValues.shop_category);
            });
            // res.localsに格納
            res.locals.targetCategoryDBId = shopCategoryDBIds[selectedCategoryIndex];
        });
        yield index_1.default.UserMemos.findAll({
            where: { user_id: loginedUserId, shop_category: presentCategory },
        }).then((allData) => {
            const memoDBIDs = [];
            allData.forEach((data) => {
                memoDBIDs.push(Number(data.dataValues.id));
            });
            // res.localsに格納
            res.locals.targetMemoDBIds = memoDBIDs;
            next();
        });
    }))();
};
exports.getDBIdOfUpdatingCategory = getDBIdOfUpdatingCategory;
const updateCategory = (req, res) => {
    // 更新するカテゴリーのインデックス番号をルートパラメータから取得
    const selectedCategoryIndex = req.params.index;
    // ログインユーザーのIDをpassportのsessionから取得
    const loginedUserId = req.user.id;
    // 更新postされたカテゴリー名を取得
    const updatedCategory = req.body.category;
    // getDBIdOfUpdateCategoryメソッドからres.localsを取得
    const targetCategoryDBId = res.locals.targetCategoryDBId;
    const targetMemoDBIds = res.locals.targetMemoDBIds;
    // shop_categoriesDBとuser_favorite_shopsDBのカテゴリー名をupdate
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield index_1.default.ShopCategories.update({ shop_category: updatedCategory }, { where: { id: targetCategoryDBId } });
            yield index_1.default.UserMemos.update({ shop_category: updatedCategory }, { where: { id: targetMemoDBIds } });
        }
        catch (error) {
            console.log(error);
        }
        finally {
            // redirect
            const redirectURL = "/memo/" + selectedCategoryIndex;
            res.redirect(redirectURL);
        }
    }))();
};
exports.updateCategory = updateCategory;
const createCategory = (req, res) => {
    // ログインユーザーのIDをpassportのsessionから取得
    const loginedUserId = req.user.id;
    // 作成postされたカテゴリー名を取得
    const createdCategory = req.body.category;
    // DBに新規登録
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield index_1.default.ShopCategories.create({
                user_id: loginedUserId,
                shop_category: createdCategory,
            });
        }
        catch (error) {
            console.log(error);
        }
        finally {
            res.redirect("/category");
        }
    }))();
};
exports.createCategory = createCategory;
// カテゴリー新規作成時の入力値空チェック&カテゴリー既存チェック
const checkCreatingCategory = (req, res, next) => {
    // getShopCategoriesメソッドからres.localsを取得
    const presentShopCategories = res.locals.shopCategories;
    // 新規作成postされた値を取得
    const postedCategory = req.body.category;
    // error文格納用の配列
    const errors = {};
    // errorチェック
    if (postedCategory === "") {
        errors["category"] = "入力してください";
    }
    if (presentShopCategories.includes(postedCategory)) {
        errors["duplication"] = "既に登録されたカテゴリーです";
    }
    if (Object.keys(errors).length > 0) {
        res.render("createCategory", {
            errors: errors,
            category: postedCategory,
        });
    }
    else {
        next();
    }
};
exports.checkCreatingCategory = checkCreatingCategory;
// カテゴリー更新時の入力値空チェック&カテゴリー既存チェック
const checkUpdatingCategory = (req, res, next) => {
    // getShopCategoriesメソッドからres.localsを取得
    const presentShopCategories = res.locals.shopCategories;
    // 更新postされた値を取得
    const postedCategory = req.body.category;
    // error文格納用の配列
    const errors = {};
    // errorチェック
    if (postedCategory === "") {
        errors["category"] = "入力してください";
    }
    if (presentShopCategories.includes(postedCategory)) {
        errors["duplication"] = "既に登録されたカテゴリーです";
    }
    if (Object.keys(errors).length > 0) {
        // getSelectedCategoryメソッドからインデックス番号を取得
        const selectedCategoryIndex = res.locals.index;
        res.render("editCategory", {
            errors: errors,
            selectedCategoryIndex: selectedCategoryIndex,
            selectedCategory: postedCategory,
        });
    }
    else {
        next();
    }
};
exports.checkUpdatingCategory = checkUpdatingCategory;
const renderDeleteCategoryPage = (req, res) => {
    // ログインユーザーのIDをpassportのsessionから取得
    const loginedUserId = req.user.id;
    // DBからデータ取得
    (() => __awaiter(void 0, void 0, void 0, function* () {
        yield index_1.default.ShopCategories.findAll({
            where: { user_id: loginedUserId },
        }).then((allData) => {
            // 全カテゴリーを取得して配列に格納
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
    // ログインユーザーのIDをpassportのsessionから取得
    const loginedUserId = req.user.id;
    // checkboxでpostされたオブジェクトからkey配列を作成
    const postedCategories = Object.keys(req.body);
    // 削除postされたカテゴリーをshop_categoriesDBとuser_favorite_shopsDBから削除
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield index_1.default.ShopCategories.destroy({
                where: { user_id: loginedUserId, shop_category: postedCategories },
            });
            yield index_1.default.UserMemos.destroy({
                where: { user_id: loginedUserId, shop_category: postedCategories },
            });
        }
        catch (error) {
            console.log(error);
        }
        res.redirect("/category");
    }))();
};
exports.deleteCategory = deleteCategory;
