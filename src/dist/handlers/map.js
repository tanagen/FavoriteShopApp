"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showMap = exports.getGoogleMapsApiKey = void 0;
const getGoogleMapsApiKey = (req, res, next) => {
    // app.envファイルからAPI_KEYの環境変数を取得
    res.locals.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    next();
};
exports.getGoogleMapsApiKey = getGoogleMapsApiKey;
const showMap = (req, res) => {
    // getGoogleMapsApiKeyメソッドからres.localsを取得
    const googleMapsApiKey = res.locals.googleMapsApiKey;
    // getSelectedCategoryメソッドからres.localsを取得
    const selectedCategoryIndex = res.locals.index;
    const selectedCategory = res.locals.selectedCategory;
    // getSelectedMemoメソッドからres.lcoalsを取得
    const selectedMemo = res.locals.selectedMemo;
    const errorMessage = res.locals.errorMessage;
    res.render("map", {
        googleMapsApiKey: googleMapsApiKey,
        selectedCategoryIndex: selectedCategoryIndex,
        selectedCategory: selectedCategory,
        selectedMemo: selectedMemo,
        errorMessage: errorMessage,
    });
};
exports.showMap = showMap;
