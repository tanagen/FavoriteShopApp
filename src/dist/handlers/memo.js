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
exports.updateMemo = exports.renderEditMemoPage = exports.getInfoOfSelectedMemo = exports.deleteMemo = exports.createMemo = exports.checkUpdatingMemo = exports.checkCreatingMemo = exports.renderCreateMemoPage = exports.renderMemoPage = exports.getSelectedCategory = void 0;
const index_1 = __importDefault(require("../models/index"));
// 操作中のカテゴリー名を取得
const getSelectedCategory = (req, res, next) => {
    // passportのsessionからidを取得
    const loginedUserId = req.user.id;
    // ルートパラメータからカテゴリーのインデックス番号を取得
    const categoryIndex = Number(req.params.index);
    res.locals.index = categoryIndex;
    // shop_categoriesDBから選択中のカテゴリーのid,shop_categoryを取得
    (() => __awaiter(void 0, void 0, void 0, function* () {
        yield index_1.default.ShopCategories.findAll({
            where: { user_id: loginedUserId },
        }).then((allData) => {
            // shop_categoryを配列に格納
            // const shopCategoryObj: {} = {};
            const shopCategoryIds = [];
            const shopCategories = [];
            allData.forEach((data) => {
                // const key: string = data.dataValues.id;
                // shopCategoryObj[key] = data.dataValues.shop_category;
                shopCategoryIds.push(Number(data.dataValues.id));
                shopCategories.push(data.dataValues.shop_category);
            });
            // 重複排除
            // const setedShopCategories: string[] = Array.from(new Set(shopCategories));
            // ルートパラメータで渡されたcategoryIndexのカテゴリー名をres.localsに格納
            // res.locals.selectedCategory = setedShopCategories[categoryIndex];
            res.locals.selectedCategoryDBId = shopCategoryIds[categoryIndex];
            res.locals.selectedCategory = shopCategories[categoryIndex];
            next();
        });
    }))();
};
exports.getSelectedCategory = getSelectedCategory;
// メモ一覧の表示
const renderMemoPage = (req, res) => {
    // passportのsessionからid,user_nameを取得
    const loginedUserId = req.user.id;
    // getSelectedCategoryメソッドで取得したres.localsの内容を変数に代入
    const selectedCategoryIndex = res.locals.index;
    const selectedCategory = res.locals.selectedCategory;
    // user_favorite_shopsDBからデータ取得
    (() => __awaiter(void 0, void 0, void 0, function* () {
        yield index_1.default.UserFavoriteShops.findAll({
            where: {
                user_id: loginedUserId,
                shop_category: selectedCategory,
            },
        }).then((data) => {
            // データが存在する場合
            if (data.length !== 0) {
                const errorMessage = "";
                const allShopInfo = data;
                // レンダリング
                res.render("memo", {
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
                res.render("memo", {
                    errorMessage: errorMessage,
                    allShopInfo: allShopInfo,
                    categoryIndex: selectedCategoryIndex,
                });
            }
        });
    }))();
};
exports.renderMemoPage = renderMemoPage;
// メモ新規登録画面の表示
const renderCreateMemoPage = (req, res) => {
    // getSelectedCategoryメソッドで取得したres.localsの内容を変数に代入
    const categoryIndex = res.locals.index;
    const selectedCategory = res.locals.selectedCategory;
    // getAPIKeyメソッドからローカル変数を取得して変数に格納
    const API_KEY = res.locals.apiKey;
    // 緯度経度情報の初期値(東京駅)
    const initLatLng = JSON.stringify({ lat: 35.6811673, lng: 139.7670516 });
    res.render("createMemo", {
        apiKey: API_KEY,
        categoryIndex: categoryIndex,
        selectedCategory: selectedCategory,
        shopName: "",
        latlng: initLatLng,
        shopDescription: "",
        errors: {},
    });
};
exports.renderCreateMemoPage = renderCreateMemoPage;
// メモ新規登録における入力値の空チェック
const checkCreatingMemo = (req, res, next) => {
    // getSelectedCategoryメソッドで取得したres.localsの内容を変数に代入
    const categoryIndex = res.locals.index;
    const selectedCategory = res.locals.selectedCategory;
    // getAPIKeyメソッドからローカル変数を取得して変数に格納
    const API_KEY = res.locals.apiKey;
    // postされた値を変数に代入
    const postedShopName = req.body.name;
    const postedShopLocation = req.body.latlng;
    const postedShopDescription = req.body.description;
    console.log(req.body);
    // error文格納用の配列
    const errors = {};
    // errorチェック
    if (postedShopName === "") {
        errors["shopName"] = "入力してください";
    }
    if (postedShopLocation === "") {
        errors["shopLocation"] = "入力してください";
    }
    if (postedShopDescription === "") {
        errors["shopDescription"] = "入力してください";
    }
    if (Object.keys(errors).length > 0) {
        res.render("createMemo", {
            apiKey: API_KEY,
            categoryIndex: categoryIndex,
            selectedCategory: selectedCategory,
            shopName: postedShopName,
            latlng: postedShopLocation,
            shopDescription: postedShopDescription,
            errors: errors,
        });
    }
    else {
        next();
    }
};
exports.checkCreatingMemo = checkCreatingMemo;
// メモ更新における入力値の空チェックミドルウェア
const checkUpdatingMemo = (req, res, next) => {
    // getSelectedCategoryメソッドで取得したres.localsの内容を変数に代入
    const categoryIndex = res.locals.index;
    const selectedCategory = res.locals.selectedCategory;
    // ルートパラメータから選択したlistIDを取得
    const selectedShopId = req.params.id;
    // postされた内容を変数に代入
    const postedShopName = req.body.name;
    const postedShopLocation = req.body.latlng;
    const postedShopDescription = req.body.description;
    // error文格納用の配列
    const errors = {};
    // errorチェック
    if (postedShopName === "") {
        errors["shopName"] = "入力してください";
    }
    if (postedShopLocation === "") {
        errors["shopLocation"] = "入力してください";
    }
    if (postedShopDescription === "") {
        errors["shopDescription"] = "入力してください";
    }
    if (Object.keys(errors).length > 0) {
        res.render("editMemo", {
            selectedCategory: selectedCategory,
            errorMessage: "",
            shopId: selectedShopId,
            shopName: postedShopName,
            latlng: postedShopLocation,
            shopDescription: postedShopDescription,
            categoryIndex: categoryIndex,
            errors: errors,
        });
    }
    else {
        next();
    }
};
exports.checkUpdatingMemo = checkUpdatingMemo;
// メモの新規登録
const createMemo = (req, res) => {
    // passportのsessionからidを取得
    const loginedUserId = req.user.id;
    // ルートパラメータからcategoryIndexを取得して変数に代入
    const selectedCategoryIndex = req.params.index;
    // getSelectedCategoryメソッドで取得したres.localsの内容を変数に代入
    const selectedCategory = res.locals.selectedCategory;
    // formでpostされた内容を取得
    const createdShopName = req.body.name;
    const createdLatLng = req.body.latlng;
    const createdDescription = req.body.description;
    console.log(createdLatLng);
    // postされた内容をuser_favorite_shopsDBに格納
    (() => __awaiter(void 0, void 0, void 0, function* () {
        // const t = await db.UserFavoriteShops.sequelize!.transaction();
        try {
            // createメソッドはbuild+saveを一度に行い、データベースにinsertまで行う
            yield index_1.default.UserFavoriteShops.create({
                user_id: loginedUserId,
                shop_category: selectedCategory,
                shop_name: createdShopName,
                shop_location: createdLatLng,
                shop_description: createdDescription,
            });
            // await t?.commit;
        }
        catch (error) {
            console.log(error);
            // await t?.rollback();
        }
        // redirect
        const redirectURL = "/memo/" + selectedCategoryIndex;
        res.redirect(redirectURL);
    }))();
};
exports.createMemo = createMemo;
// メモの削除
const deleteMemo = (req, res) => {
    const selectedCategoryIndex = req.params.index;
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Users.createメソッドは下記のbuild+saveを一度に行い、データベースにinsertまで行う
            yield index_1.default.UserFavoriteShops.destroy({
                where: {
                    id: req.params.id,
                },
            });
        }
        catch (error) {
            console.log(error);
        }
        // redirect
        const redirectURL = "/memo/" + selectedCategoryIndex;
        res.redirect(redirectURL);
    }))();
};
exports.deleteMemo = deleteMemo;
// 選択したメモの情報取得
const getInfoOfSelectedMemo = (req, res, next) => {
    // ルートパラメータから選択したリストIdを取得
    const selectedShopId = req.params.id;
    // 選択したリストIdの情報をuser_favorite_shopsDBから取得
    (() => __awaiter(void 0, void 0, void 0, function* () {
        // user_favorite_shopsDBからデータ取得
        yield index_1.default.UserFavoriteShops.findAll({
            where: {
                id: selectedShopId,
            },
        }).then((data) => {
            // データが存在する場合
            if (data.length !== 0) {
                const errorMessage = "";
                const shopInfo = data[0];
                // const shopId = shopInfo.id;
                // const shopName = shopInfo.shop_name;
                // const shopLocation = shopInfo.shop_location;
                // const shopDescription = shopInfo.shop_description;
                res.locals.errorMessage = errorMessage;
                res.locals.selectedShopInfo = shopInfo;
                // データが存在しない場合
            }
            else {
                const errorMessage = "情報取得エラー";
                // const shopId: any = "";
                // const shopName: any = "";
                // const shopLocation: any = "";
                // const shopDescription: any = "";
                res.locals.errorMessage = errorMessage;
                res.locals.selectedShopInfo = "";
            }
            next();
        });
    }))();
};
exports.getInfoOfSelectedMemo = getInfoOfSelectedMemo;
// リスト編集画面の表示
const renderEditMemoPage = (req, res) => {
    // getSelectedCategoryメソッドで取得したres.localsの内容を変数に代入
    const categoryIndex = res.locals.index;
    const selectedCategory = res.locals.selectedCategory;
    // ルートパラメータから選択したリストIdを取得
    const selectedShopId = req.params.id;
    // 選択したリストIdの情報をuser_favorite_shopsDBから取得
    (() => __awaiter(void 0, void 0, void 0, function* () {
        // user_favorite_shopsDBからデータ取得
        yield index_1.default.UserFavoriteShops.findAll({
            where: {
                id: selectedShopId,
            },
        }).then((data) => {
            // データが存在する場合
            if (data.length !== 0) {
                const errorMessage = "";
                const shopInfo = data[0];
                const shopId = shopInfo.id;
                const shopName = shopInfo.shop_name;
                const shopLatLng = shopInfo.shop_location;
                const shopDescription = shopInfo.shop_description;
                // レンダリング
                res.render("editMemo", {
                    selectedCategory: selectedCategory,
                    errorMessage: errorMessage,
                    shopId: shopId,
                    shopName: shopName,
                    latlng: shopLatLng,
                    shopDescription: shopDescription,
                    categoryIndex: categoryIndex,
                    errors: "",
                });
                // データが存在しない場合
            }
            else {
                const errorMessage = "情報取得エラー";
                const shopId = "";
                const shopName = "";
                const shopLatLng = "";
                const shopDescription = "";
                // レンダリング
                res.render("editMemo", {
                    selectedCategory: selectedCategory,
                    errorMessage: errorMessage,
                    shopId: shopId,
                    shopName: shopName,
                    latlng: shopLatLng,
                    shopDescription: shopDescription,
                    categoryIndex: categoryIndex,
                    errors: "",
                });
            }
        });
    }))();
};
exports.renderEditMemoPage = renderEditMemoPage;
const updateMemo = (req, res) => {
    // post先URLのルートパラメータを変数に代入
    const selectedCategoryIndex = req.params.index;
    const selectedShopId = req.params.id;
    // user_favorite_shopsDBの選択したリストIdの情報を更新
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield index_1.default.UserFavoriteShops.update({
                shop_name: req.body.name,
                shop_location: req.body.latlng,
                shop_description: req.body.description,
            }, { where: { id: selectedShopId } });
        }
        catch (error) {
            console.log(error);
        }
        // redirect
        const redirectURL = "/memo/" + selectedCategoryIndex;
        res.redirect(redirectURL);
    }))();
};
exports.updateMemo = updateMemo;
