"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.renderLoginPage = void 0;
const passport_1 = __importDefault(require("passport"));
// ログインページの表示
const renderLoginPage = (req, res) => {
    // ログインに失敗したときのエラーメッセージをsessionから取得
    const errorMessage = req.flash("error").join("<br>");
    res.render("login", { errorMessage: errorMessage });
};
exports.renderLoginPage = renderLoginPage;
// ログイン
exports.login = passport_1.default.authenticate("local", {
    successRedirect: "./category",
    failureRedirect: "./login",
    failureFlash: "「メールアドレス」もしくは「パスワード」が誤っています。",
});
