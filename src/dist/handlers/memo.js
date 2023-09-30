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
exports.updateMemo = exports.renderEditMemoPage = exports.getSelectedMemo = exports.deleteMemo = exports.createMemo = exports.checkUpdatingMemo = exports.checkCreatingMemo = exports.renderCreateMemoPage = exports.renderMemoPage = exports.getSelectedCategory = void 0;
const index_1 = __importDefault(require("../models/index"));
// 選択したカテゴリーの情報を取得
const getSelectedCategory = (req, res, next) => {
    // ログインユーザーのIDをpassportのsessionから取得
    const loginedUserId = req.user.id;
    // 選択したカテゴリーのインデックス番号をルートパラメータから取得し、ローカル変数に格納
    const categoryIndex = Number(req.params.index);
    res.locals.index = categoryIndex;
    // 選択中のカテゴリーのDBにおけるIDとカテゴリー名の情報を取得
    (() => __awaiter(void 0, void 0, void 0, function* () {
        yield index_1.default.ShopCategories.findAll({
            where: { user_id: loginedUserId },
        }).then((allData) => {
            // 配列に格納
            const CategoryDBIDs = [];
            const Categories = [];
            allData.forEach((data) => {
                CategoryDBIDs.push(Number(data.dataValues.id));
                Categories.push(data.dataValues.shop_category);
            });
            // res.localsに格納
            res.locals.selectedCategoryDBId = CategoryDBIDs[categoryIndex];
            res.locals.selectedCategory = Categories[categoryIndex];
            next();
        });
    }))();
};
exports.getSelectedCategory = getSelectedCategory;
// メモ一覧ページの表示
const renderMemoPage = (req, res) => {
    // ログインユーザーのIDをpassportのsessionから取得
    const loginedUserId = req.user.id;
    // getSelectedCategoryメソッドで取得したres.localsの内容を取得
    const selectedCategoryIndex = res.locals.index;
    const selectedCategory = res.locals.selectedCategory;
    // DBからデータ取得
    (() => __awaiter(void 0, void 0, void 0, function* () {
        yield index_1.default.UserMemos.findAll({
            where: {
                user_id: loginedUserId,
                shop_category: selectedCategory,
            },
        }).then((data) => {
            // データが存在する場合
            if (data.length !== 0) {
                const errorMessage = "";
                const memos = data;
                res.render("memo", {
                    errorMessage: errorMessage,
                    memos: memos,
                    selectedCategory: selectedCategory,
                    selectedCategoryIndex: selectedCategoryIndex,
                });
            }
            else {
                // データが存在しない場合
                const errorMessage = "メモが登録されていません";
                const memos = [];
                res.render("memo", {
                    errorMessage: errorMessage,
                    memos: memos,
                    selectedCategory: selectedCategory,
                    selectedCategoryIndex: selectedCategoryIndex,
                });
            }
        });
    }))();
};
exports.renderMemoPage = renderMemoPage;
// メモ新規作成ページの表示
const renderCreateMemoPage = (req, res) => {
    // getSelectedCategoryメソッドで取得したres.localsを取得
    const selectedCategoryIndex = res.locals.index;
    const selectedCategory = res.locals.selectedCategory;
    // getGoogleMapsApiKeyメソッドからres.localsを取得
    const googleMapsApiKey = res.locals.googleMapsApiKey;
    // 緯度経度情報の初期値(東京駅)
    const initLatLng = JSON.stringify({ lat: 35.6811673, lng: 139.7670516 });
    res.render("createMemo", {
        googleMapsApiKey: googleMapsApiKey,
        selectedCategoryIndex: selectedCategoryIndex,
        selectedCategory: selectedCategory,
        shopName: "",
        shopLatLng: initLatLng,
        hotpepperLink: "",
        shopDescription: "",
        errors: {},
    });
};
exports.renderCreateMemoPage = renderCreateMemoPage;
// メモ新規作成時の入力値空チェック
const checkCreatingMemo = (req, res, next) => {
    // getSelectedCategoryメソッドからres.localsを取得
    const selectedCategoryIndex = res.locals.index;
    const selectedCategory = res.locals.selectedCategory;
    // getgoogleMapsApiKeyメソッドからres.localsを取得
    const googleMapsApiKey = res.locals.googleMapsApiKey;
    // postされた値を変数に代入
    const postedShopName = req.body.name;
    const postedShopLatLng = req.body.latlng;
    const postedHotpepperLink = req.body.hotpepper;
    const postedShopDescription = req.body.description;
    // error文格納用の配列
    const errors = {};
    // errorチェック
    if (postedShopName === "") {
        errors["shopName"] = "入力してください";
    }
    if (postedShopLatLng === "") {
        errors["shopLocation"] = "入力してください";
    }
    if (postedShopDescription === "") {
        errors["shopDescription"] = "入力してください";
    }
    if (Object.keys(errors).length > 0) {
        // 1つでもエラーがある場合
        res.render("createMemo", {
            googleMapsApiKey: googleMapsApiKey,
            selectedCategoryIndex: selectedCategoryIndex,
            selectedCategory: selectedCategory,
            shopName: postedShopName,
            shopLatLng: postedShopLatLng,
            hotpepperLink: postedHotpepperLink,
            shopDescription: postedShopDescription,
            errors: errors,
        });
    }
    else {
        next();
    }
};
exports.checkCreatingMemo = checkCreatingMemo;
// メモ更新時の入力値空チェック
const checkUpdatingMemo = (req, res, next) => {
    // getSelectedCategoryメソッドで取得したres.localsの内容を取得
    const selectedCategoryIndex = res.locals.index;
    const selectedCategory = res.locals.selectedCategory;
    // 選択したメモのIDをルートパラメータから取得
    const selectedMemoId = req.params.id;
    // postされた内容を変数に代入
    const postedShopName = req.body.name;
    const postedShopLatLng = req.body.latlng;
    const postedHotpepperLink = req.body.hotpepper;
    const postedShopDescription = req.body.description;
    // error文格納用の配列
    const errors = {};
    // errorチェック
    if (postedShopName === "") {
        errors["shopName"] = "入力してください";
    }
    if (postedShopLatLng === "") {
        errors["shopLocation"] = "入力してください";
    }
    if (postedShopDescription === "") {
        errors["shopDescription"] = "入力してください";
    }
    if (Object.keys(errors).length > 0) {
        res.render("editMemo", {
            selectedCategoryIndex: selectedCategoryIndex,
            selectedCategory: selectedCategory,
            selectedMemoId: selectedMemoId,
            shopName: postedShopName,
            shopLatLng: postedShopLatLng,
            hotpepperLink: postedHotpepperLink,
            shopDescription: postedShopDescription,
            errorMessage: "",
            errors: errors,
        });
    }
    else {
        next();
    }
};
exports.checkUpdatingMemo = checkUpdatingMemo;
// メモの新規作成
const createMemo = (req, res) => {
    // ログインユーザーのIDをpassportのsessionから取得
    const loginedUserId = req.user.id;
    // 新規作成するメモが属するカテゴリーのインデックス番号をルートパラメータから取得
    const selectedCategoryIndex = req.params.index;
    // getSelectedCategoryメソッドで取得したres.localsの内容を取得
    const selectedCategory = res.locals.selectedCategory;
    // formでpostされた内容を取得
    const createdShopName = req.body.name;
    const createdShopLatLng = req.body.latlng;
    const createdHotpepperLink = req.body.hotpepper;
    const createdShopDescription = req.body.description;
    // postされた内容をuser_favorite_shopsDBに格納
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // createメソッドはbuild+saveを一度に行い、データベースにinsertまで行う
            yield index_1.default.UserMemos.create({
                user_id: loginedUserId,
                shop_category: selectedCategory,
                shop_name: createdShopName,
                shop_location: createdShopLatLng,
                shop_hotpepperlink: createdHotpepperLink,
                shop_description: createdShopDescription,
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
exports.createMemo = createMemo;
// メモの削除
const deleteMemo = (req, res) => {
    // 削除対象のメモが属するカテゴリーのインデックス番号をルートパラメータから取得
    const selectedCategoryIndex = req.params.index;
    // DBから削除
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield index_1.default.UserMemos.destroy({
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
// 選択したメモの情報をDBから取得
const getSelectedMemo = (req, res, next) => {
    // 選択したメモのIDをルートパラメータから取得
    const selectedMemoID = req.params.id;
    // 選択したメモの情報をDBから取得
    (() => __awaiter(void 0, void 0, void 0, function* () {
        yield index_1.default.UserMemos.findAll({
            where: {
                id: selectedMemoID,
            },
        }).then((data) => {
            // データが存在する場合
            if (data.length !== 0) {
                const errorMessage = "";
                const selectedMemo = data[0];
                res.locals.errorMessage = errorMessage;
                res.locals.selectedMemo = selectedMemo;
            }
            else {
                // データが存在しない場合
                const errorMessage = "情報取得エラー";
                res.locals.errorMessage = errorMessage;
                res.locals.selectedMemo = "";
            }
            next();
        });
    }))();
};
exports.getSelectedMemo = getSelectedMemo;
// リスト編集画面の表示
const renderEditMemoPage = (req, res) => {
    // getSelectedCategoryメソッドで取得したres.localsを取得
    const selectedCategoryIndex = res.locals.index;
    const selectedCategory = res.locals.selectedCategory;
    // 選択したメモのIDをルートパラメータから取得
    const selectedMemoId = req.params.id;
    // getGoogleMapsApiKeyメソッドで取得したres.localsを取得
    const googleMapsApiKey = res.locals.googleMapsApiKey;
    // 選択したメモの情報をDBから取得
    (() => __awaiter(void 0, void 0, void 0, function* () {
        yield index_1.default.UserMemos.findAll({
            where: {
                id: selectedMemoId,
            },
        }).then((data) => {
            if (data.length !== 0) {
                // データが存在する場合
                const errorMessage = "";
                const selectedMemo = data[0];
                const shopName = selectedMemo.shop_name;
                const shopLatLng = selectedMemo.shop_location;
                const hotpepperLink = selectedMemo.shop_hotpepperlink;
                const shopDescription = selectedMemo.shop_description;
                // レンダリング
                res.render("editMemo", {
                    googleMapsApiKey: googleMapsApiKey,
                    selectedCategoryIndex: selectedCategoryIndex,
                    selectedCategory: selectedCategory,
                    selectedMemoId: selectedMemoId,
                    shopName: shopName,
                    shopLatLng: shopLatLng,
                    hotpepperLink: hotpepperLink,
                    shopDescription: shopDescription,
                    errors: "",
                    errorMessage: errorMessage,
                });
                // データが存在しない場合
            }
            else {
                throw new Error("DBにデータがありません");
            }
        });
    }))();
};
exports.renderEditMemoPage = renderEditMemoPage;
const updateMemo = (req, res) => {
    // 更新するメモが属するカテゴリーのインデックス番号をルートパラメータから取得
    const selectedCategoryIndex = req.params.index;
    // 更新するメモのIDをルートパラメータから取得
    const selectedMemoId = req.params.id;
    // DBを更新
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield index_1.default.UserMemos.update({
                shop_name: req.body.name,
                shop_location: req.body.latlng,
                shop_hotpepperlink: req.body.hotpepper,
                shop_description: req.body.description,
            }, { where: { id: selectedMemoId } });
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
