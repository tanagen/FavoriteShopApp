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
exports.deleteCategory = exports.renderDeleteCategoryPage = exports.checkPostedNewCategory = exports.createShopCategory = exports.renderCreateCategoryPage = exports.renderShopCategoryPage = void 0;
const index_1 = __importDefault(require("../models/index"));
const renderShopCategoryPage = (req, res) => {
    // passportのsessionからid,user_nameを取得
    const loginedUserId = req.user.id;
    const loginedUserName = req.user.user_name;
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
            // category.ejsをレンダリング
            res.render("category", {
                // loginedUserId: loginedUserId,
                loginedUserName: loginedUserName,
                shopCategories: setedShopCategories,
            });
        });
    }))();
};
exports.renderShopCategoryPage = renderShopCategoryPage;
const renderCreateCategoryPage = (req, res) => {
    const loginedUserId = req.user.id;
    res.render("createCategory", { errors: {} }); // { loginedUserId: loginedUserId }
};
exports.renderCreateCategoryPage = renderCreateCategoryPage;
const createShopCategory = (req, res) => {
    const loginedUserId = req.user.id;
    // formでpostされたcateogryを取得
    const createdCategory = req.body.category;
    // 取得したcategoryをshop_categoriesDBに格納
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const t = yield index_1.default.ShopCategories.sequelize.transaction();
        try {
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
        res.redirect("/category");
    }))();
};
exports.createShopCategory = createShopCategory;
// カテゴリー新規登録における入力値の空チェック
const checkPostedNewCategory = (req, res, next) => {
    // postされた内容を変数に代入
    const postedCategory = req.body.category;
    // error文格納用の配列
    const errors = {};
    // errorチェック
    if (postedCategory === "") {
        errors["category"] = "入力してください";
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
    // passportのsessionからid,user_nameを取得
    const loginedUserId = req.user.id;
    // checkboxで選択してpostされたオブジェクトのkeyの配列を作成
    const postedCategories = Object.keys(req.body);
    // postされたcategoryをshop_categoriesDBとuser_favorite_shopsDBから削除
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const t = yield index_1.default.ShopCategories.sequelize.transaction();
        try {
            yield index_1.default.ShopCategories.destroy({
                where: { user_id: loginedUserId, shop_category: postedCategories },
            });
            yield index_1.default.UserFavoriteShops.destroy({
                where: { user_id: loginedUserId, shop_category: postedCategories },
            });
            yield t.commit;
        }
        catch (error) {
            console.log(error);
            yield t.rollback();
        }
        // redirect
        res.redirect("/category");
    }))();
    // // passportのsessionからid,user_nameを取得
    // const loginedUserId: number = req.user!.id;
    // // checkboxで選択してpostされたオブジェクトのkeyの配列を作成
    // const postedCategories: string[] = Object.keys(req.body);
    // // postされたcategoryをshop_categoriesDBとuser_favorite_shopsDBから削除
    // (async () => {
    //   const t1 = await db.ShopCategories.sequelize!.transaction();
    //   try {
    //     await db.ShopCategories.destroy({
    //       where: { user_id: loginedUserId, shop_category: postedCategories },
    //     });
    //     await t1?.commit;
    //   } catch (error) {
    //     console.log(error);
    //     await t1?.rollback();
    //   }
    //   //
    //   const t2 = await db.UserFavoriteShops.sequelize!.transaction();
    //   try {
    //     await db.UserFavoriteShops.destroy({
    //       where: { user_id: loginedUserId, shop_category: postedCategories },
    //     });
    //     await t2?.commit;
    //   } catch (error) {
    //     console.log(error);
    //     await t2?.rollback();
    //   }
    //   // const t2 = await db.UserFavoriteShops.sequelize!.transaction();
    //   // try {
    //   //   // Users.createメソッドは下記のbuild+saveを一度に行い、データベースにinsertまで行う
    //   //   await db.UserFavoriteShops.destroy({
    //   //     where: {
    //   //       shop_category: postedCategory,
    //   //     },
    //   //   });
    //   //   await t2?.commit;
    //   // } catch (error) {
    //   //   console.log(error);
    //   //   await t2?.rollback();
    //   // }
    //   // redirect
    //   res.redirect("/category");
    // })();
};
exports.deleteCategory = deleteCategory;
