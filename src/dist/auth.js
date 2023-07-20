"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_1 = __importDefault(require("passport"));
const LocasStrategy = require("passport-local").Strategy; // importで読み込むと型定義ファイルが見つからないエラーになる
const index_1 = __importDefault(require("./models/index"));
// 認証処理
passport_1.default.use(new LocasStrategy({
    // デフォルトパラメータ名をオーバーライド
    usernameField: "email",
    passwordField: "password",
}, (email, password, done) => {
    // postのnameタグから取得したemailを指定してUsersDBにアクセス
    index_1.default.Users.findOne({
        where: { user_email: email },
    })
        .then((user) => {
        // userが存在したらパスワードが一致するかチェック
        if (user && bcrypt_1.default.compareSync(password, user.user_password)) {
            return done(null, user); // ログイン成功
        }
        throw new Error();
    })
        .catch((erro) => {
        // エラー処理
        return done(null, false, {
            message: "認証情報と一致するレコードがありません",
        });
    });
}));
// ユーザー情報をsessionに保存する
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
// IDからユーザー情報を特定し、req.userに保存する
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
exports.default = passport_1.default;
