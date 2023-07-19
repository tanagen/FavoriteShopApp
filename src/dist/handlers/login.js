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
// const email = req.body.email;
// const password = req.body.password;
// (async () => {
//   await db.Users.findAll({ where: { user_email: email } }).then((results) => {
//     if (results.length > 0) {
//       if (password === results[0].user_password) {
//         req.session.userId = results[0].id;
//         console.log("認証に成功しました！");
//         res.redirect("/category");
//       } else {
//         console.log("認証に失敗しました。。。");
//         res.redirect("/login");
//       }
//     } else {
//       console.log("ユーザー情報が登録されていません");
//       res.redirect("./login");
//     }
//   });
// })();
