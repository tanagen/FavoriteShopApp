import express, { Request, Response, NextFunction } from "express";

import createError from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import topRoutes from "./routes/top";
import loginRoutes from "./routes/login";
import signUpRoutes from "./routes/signUp";
import categoryRoutes from "./routes/category";
import memoRoutes from "./routes/memo";
import logoutRoutes from "./routes/logout";
import hotpepperRoutes from "./routes/hotpepper";

import db from "./models/index";
import session from "express-session";
import passport from "./auth";
import flash from "connect-flash";
// import cors from "cors";

const app = express();

// // モデルをdbに同期
// (async () => {
//   await db.Users.sync({ force: true });
//   // await db.UserFavoriteShops.sync({ force: true });
//   // await db.ShopCategories.sync({ force: true });

//   const t = await db.Users.sequelize?.transaction();

//   try {
//     await db.Users.create({
//       user_name: "gen",
//       user_email: "gen@test.com",
//       user_password: bcrypt.hashSync("passw0rd", bcrypt.genSaltSync(8)),
//     });

//     await t?.commit;
//   } catch (error) {
//     await t?.rollback();
//   }
// })();

// view engine setup
app.set("views", path.join("views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join("public")));
app.use(flash());
// app.use(cors());

// sessionの設定
app.use(
  session({
    secret: "my_secret_key", // 指定した文字列を使ってクッキーIDを暗号化しクッキーIDが書き換えらているかを判断する
    resave: false, // セッションにアクセスすると上書きされるするオプション
    saveUninitialized: false, // 未初期化状態のセッションも保存するようなオプション
    cookie: {
      maxAge: 1000 * 60 * 30, // セッションの消滅時間。単位はミリ秒。30分と指定。
    },
  })
);

// passportの初期化
app.use(passport.initialize());
// sessionが有効な間、リクエストのたびにデシリアライズを実行し、req.userの更新を行う
app.use(passport.session());

// ルーティング
app.use("/", topRoutes);
app.use("/login", loginRoutes);
app.use("/signUp", signUpRoutes);
app.use("/logout", logoutRoutes);
app.use("/category", categoryRoutes);
app.use("/memo", memoRoutes);
app.use("/hotpepper", hotpepperRoutes);

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
