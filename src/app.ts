// export const express = require("express");
import express from "express";
export const router = express.Router();

let createError = require("http-errors");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");

// const loginRoutes = require("./routes/login");
import loginRoutes from "./routes/login";
// const categoryRoutes = require("./routes/category");
import categoryRoutes from "./routes/category";
const listRoutes = require("./routes/list");

// import db from "./models/index";

const app = express();

// モデルをdbに同期
// (async () => {
//   await db.Users.sync({ force: true });
//   await db.UserFavoriteShops.sync({ force: true });
//   await db.ShopCategories.sync({ force: true });
// })();

// view engine setup
app.set("views", path.join("views"));
app.set("view engine", "ejs");
app.use(express.static(path.join("public")));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ルーティング
app.use("/login", loginRoutes);
app.use("/category", categoryRoutes);
app.use("/list", listRoutes);

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
