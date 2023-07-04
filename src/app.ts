var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

import models from "./models";

(async () => {
  // Users, UsersFavoriteShopsテーブルをDrop & Create
  await models.Users.sync({ force: true });
  await models.UserFavoriteShops.sync({ force: true });

  // userインスタンス作成
  const user = models.Users.build({
    user_name: "gen",
    user_email: "gen@mail.com",
  });

  // userのinsert
  const registerdUser = await user.save();

  // insertされたuserに紐づくuserFavoriteShopを作成
  await registerdUser.createUserFavoriteShop({ favorite_shop: "ABCマート" });

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
