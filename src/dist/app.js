"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = exports.express = void 0;
exports.express = require("express");
exports.router = exports.express.Router();
var createError = require("http-errors");
// var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const categoryRoutes = require("./routes/category");
const index_1 = __importDefault(require("./routes/index"));
const usersRoutes = require("./routes/users");
const app = (0, exports.express)();
// view engine setup
app.set("views", path.join("views"));
app.set("view engine", "ejs");
app.use(exports.express.static(path.join("public")));
// ルーティング
app.use("/", categoryRoutes);
app.use("/index", index_1.default);
app.use("/users", usersRoutes);
// // asyncは非同期処理関数を定義する演算子
// (async () => {
//   // Users, UsersFavoriteShopsテーブルをDrop & Create
//   // awaitはPromise処理の結果が返ってくるまで一時停止する演算子(await Promise処理)
//   // { force:true }はすでに同じ名前のテーブルが存在する場合に、既存のものを削除して新たに再作成するオプション
//   await models.Users.sync({ force: true });
//   await models.UserFavoriteShops.sync({ force: true });
//   // userインスタンス作成
//   // Users.createメソッドは下記のbuild+saveを一度に行い、データベースにinsertまで行う
//   const user = models.Users.build({
//     user_name: "gen",
//     user_email: "gen@mail.com",
//   });
//   // userのinsert
//   const registeredUser = await user.save();
//   // insertされたuserに紐づくuserFavoriteShopを作成
//   await registeredUser.createUserFavoriteShop({
//     shop_category: "飲食",
//     shop_name: "天下一品",
//   });
// })();
// // mySQLへデータを追加
// (async () => {
//   // { alter: true }は既にあるテーブルと相違がある場合に追加や削除が行われる。
//   await models.Users.sync({ force: true });
//   await models.UserFavoriteShops.sync({ force: true });
//   // userインスタンス作成
//   // Users.createメソッドは下記のbuild+saveを一度に行い、データベースにinsertまで行う
//   const newUser = models.Users.build({
//     user_name: "ai",
//     user_email: "ai@mail.com",
//   });
//   // userのinsert
//   const registeredNewUser = await newUser.save();
//   // insertされたuserに紐づくuserFavoriteShopを作成
//   await registeredNewUser.createUserFavoriteShop({
//     shop_category: "美容",
//     shop_name: "ヘッドマッサージ",
//   });
//   await registeredNewUser.createUserFavoriteShop({
//     shop_category: "飲食",
//     shop_name: "たこ焼き",
//   });
//   await models.UserFavoriteShops.bulkCreate([
//     { user_id: 1, shop_category: "娯楽", shop_name: "パチンコ" },
//   ]);
//   // // usersのselect
//   // const users = await models.Users.findAll({
//   //   include: [models.UserFavoriteShops],
//   // });
//   // // console.log(users.map((d) => d.toJSON()));
//   // console.log(JSON.stringify(users));
// })();
app.use(logger("dev"));
app.use(exports.express.json());
app.use(exports.express.urlencoded({ extended: false }));
app.use(cookieParser());
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
