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
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var app = express();
const models_1 = __importDefault(require("./models"));
// asyncは非同期処理関数を定義する演算子
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Users, UsersFavoriteShopsテーブルをDrop & Create
    // awaitはPromise処理の結果が返ってくるまで一時停止する演算子(await Promise処理)
    // { force:true }はすでに同じ名前のテーブルが存在する場合に、既存のものを削除して新たに再作成するオプション
    yield models_1.default.Users.sync({ force: true });
    yield models_1.default.UserFavoriteShops.sync({ force: true });
    // userインスタンス作成
    // Users.createメソッドは下記のbuild+saveを一度に行い、データベースにinsertまで行う
    const user = models_1.default.Users.build({
        user_name: "gen",
        user_email: "gen@mail.com",
    });
    // userのinsert
    const registeredUser = yield user.save();
    // insertされたuserに紐づくuserFavoriteShopを作成
    yield registeredUser.createUserFavoriteShop({ favorite_shop: "ABCマート" });
    // usersのselect
    // const users = await models.Users.findAll({
    //   // belongsToの関係にあるモデルをリレーションを持った状態でDBから取り出してくれる
    //   include: [models.UserFavoriteShops],
    // });
    // console.log(users.map((d) => d.toJSON()));
}))();
// mySQLへデータを追加
(() => __awaiter(void 0, void 0, void 0, function* () {
    // { alter: true }は既にあるテーブルと相違がある場合に追加や削除が行われる。
    yield models_1.default.Users.sync({ force: true });
    yield models_1.default.UserFavoriteShops.sync({ force: true });
    // userインスタンス作成
    // Users.createメソッドは下記のbuild+saveを一度に行い、データベースにinsertまで行う
    const newUser = models_1.default.Users.build({
        user_name: "ai",
        user_email: "ai@mail.com",
    });
    // userのinsert
    const registeredNewUser = yield newUser.save();
    // insertされたuserに紐づくuserFavoriteShopを作成
    yield registeredNewUser.createUserFavoriteShop({ favorite_shop: "スタバ" });
    // usersのselect
    const users = yield models_1.default.Users.findAll({
        include: [models_1.default.UserFavoriteShops],
    });
    console.log(users.map((d) => d.toJSON()));
}))();
// view engine setup
app.set("views", path.join("views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join("public")));
app.use("/", indexRouter);
app.use("/users", usersRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});
module.exports = app;
