var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

import models from "./models";

// asyncは非同期処理関数を定義する演算子
(async () => {
  // Users, UsersFavoriteShopsテーブルをDrop & Create
  // awaitはPromise処理の結果が返ってくるまで一時停止する演算子(await Promise処理)
  // { force:true }はすでに同じ名前のテーブルが存在する場合に、既存のものを削除して新たに再作成するオプション
  await models.Users.sync({ force: true });
  await models.UserFavoriteShops.sync({ force: true });

  // userインスタンス作成
  // Users.createメソッドは下記のbuild+saveを一度に行い、データベースにinsertまで行う
  const user = models.Users.build({
    user_name: "gen",
    user_email: "gen@mail.com",
  });

  // userのinsert
  const registeredUser = await user.save();

  // insertされたuserに紐づくuserFavoriteShopを作成
  await registeredUser.createUserFavoriteShop({ favorite_shop: "ABCマート" });

  // usersのselect
  // const users = await models.Users.findAll({
  //   // belongsToの関係にあるモデルをリレーションを持った状態でDBから取り出してくれる
  //   include: [models.UserFavoriteShops],
  // });
  // console.log(users.map((d) => d.toJSON()));
})();

// mySQLへデータを追加
(async () => {
  // { alter: true }は既にあるテーブルと相違がある場合に追加や削除が行われる。
  await models.Users.sync({ force: true });
  await models.UserFavoriteShops.sync({ force: true });

  // userインスタンス作成
  // Users.createメソッドは下記のbuild+saveを一度に行い、データベースにinsertまで行う
  const newUser = models.Users.build({
    user_name: "ai",
    user_email: "ai@mail.com",
  });

  // userのinsert
  const registeredNewUser = await newUser.save();

  // insertされたuserに紐づくuserFavoriteShopを作成
  await registeredNewUser.createUserFavoriteShop({ favorite_shop: "スタバ" });

  // usersのselect
  const users = await models.Users.findAll({
    include: [models.UserFavoriteShops],
  });
  console.log(users.map((d) => d.toJSON()));
})();

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
app.use(function (req: any, res: any, next: any) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: any, res: any, next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
