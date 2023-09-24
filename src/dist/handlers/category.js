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
exports.deleteCategory = exports.renderDeleteCategoryPage = exports.checkUpdatingCategory = exports.checkCreatingCategory = exports.createCategory = exports.updateCategory = exports.getDBIdOfUpdateCategory = exports.renderEditCategoryPage = exports.renderCreateCategoryPage = exports.renderCategoryPage = exports.getInfoOfCategories = void 0;
const index_1 = __importDefault(require("../models/index"));
const getInfoOfCategories = (req, res, next) => {
    // passportのsessionからid,user_nameを取得
    const loginedUserId = req.user.id;
    (() => __awaiter(void 0, void 0, void 0, function* () {
        // shop_categoriesDBからデータ取得
        yield index_1.default.ShopCategories.findAll({
            where: { user_id: loginedUserId },
        }).then((allData) => {
            // allDataからid,shop_categoryを取得してそれぞれ配列に格納
            const shopCategoryIds = [];
            const shopCategories = [];
            allData.forEach((data) => {
                shopCategoryIds.push(Number(data.dataValues.id));
                shopCategories.push(data.dataValues.shop_category);
            });
            // 重複排除
            // const setedShopCategories: string[] = Array.from(new Set(shopCategories));
            // res.localに格納
            res.locals.shopCategoryIds = shopCategoryIds;
            res.locals.shopCategories = shopCategories;
            next();
        });
    }))();
};
exports.getInfoOfCategories = getInfoOfCategories;
const renderCategoryPage = (req, res) => {
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
exports.renderCategoryPage = renderCategoryPage;
const renderCreateCategoryPage = (req, res) => {
    // const loginedUserId: number = req.user!.id;
    res.render("createCategory", { errors: {}, category: "" });
};
exports.renderCreateCategoryPage = renderCreateCategoryPage;
const renderEditCategoryPage = (req, res) => {
    // getSelectedCategoryメソッドで取得したindex, category名を変数に格納
    const selectedCategoryIndex = res.locals.index;
    const selectedCategory = res.locals.selectedCategory;
    res.render("editCategory", {
        errors: {},
        selectedCategoryIndex: selectedCategoryIndex,
        selectedCategory: selectedCategory,
    });
};
exports.renderEditCategoryPage = renderEditCategoryPage;
const getDBIdOfUpdateCategory = (req, res, next) => {
    // passportのsessionからuserIdを取得
    const loginedUserId = req.user.id;
    // getSelectedCategoryメソッドで取得したres.localsの内容を変数に代入
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
            // res.locals.presentCategory = shopCategories[selectedCategoryIndex];
        });
        yield index_1.default.UserMemos.findAll({
            where: { user_id: loginedUserId, shop_category: presentCategory },
        }).then((allData) => {
            const userFavoriteShopDBIds = [];
            allData.forEach((data) => {
                userFavoriteShopDBIds.push(Number(data.dataValues.id));
            });
            // res.localsに格納
            res.locals.targetUserFavoriteShopDBIds = userFavoriteShopDBIds;
            next();
        });
    }))();
};
exports.getDBIdOfUpdateCategory = getDBIdOfUpdateCategory;
const updateCategory = (req, res) => {
    // postURLのルートパラメータからselectedCategoryIndexを取得して変数に格納
    const selectedCategoryIndex = req.params.index;
    // passportのsessionからuserIdを取得
    const loginedUserId = req.user.id;
    // 更新postされたカテゴリー名を変数に格納
    const updatedCategory = req.body.category;
    // getDBIdOfUpdateCategoryメソッドで取得したres.localsの内容を変数に格納
    const targetCategoryDBId = res.locals.targetCategoryDBId;
    const targetUserFavoriteShopDBIds = res.locals.targetUserFavoriteShopDBIds;
    // shop_categoriesDBとuser_favorite_shopsDBのカテゴリー名をupdate
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield index_1.default.ShopCategories.update({ shop_category: updatedCategory }, { where: { id: targetCategoryDBId } });
            yield index_1.default.UserMemos.update({ shop_category: updatedCategory }, { where: { id: targetUserFavoriteShopDBIds } });
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
    const loginedUserId = req.user.id;
    // formでpostされたcateogryを取得
    const createdCategory = req.body.category;
    // 取得したcategoryをshop_categoriesDBに格納
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
            // redirect
            res.redirect("/category");
        }
    }))();
};
exports.createCategory = createCategory;
// カテゴリー新規登録における入力値の空チェック&既存カテゴリーチェック
const checkCreatingCategory = (req, res, next) => {
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
// カテゴリー更新における入力値の空チェック&既存カテゴリーチェック
const checkUpdatingCategory = (req, res, next) => {
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
    if (presentShopCategories.includes(postedCategory)) {
        errors["duplication"] = "既に登録されたカテゴリーです";
    }
    if (Object.keys(errors).length > 0) {
        // getSelectedCategoryメソッドで取得したindexを変数に格納
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
            yield index_1.default.UserMemos.destroy({
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
