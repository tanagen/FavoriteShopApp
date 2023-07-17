"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
// export const express = require("express");
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
let createError = require("http-errors");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
// const loginRoutes = require("./routes/login");
const login_1 = __importDefault(require("./routes/login"));
// const categoryRoutes = require("./routes/category");
const category_1 = __importDefault(require("./routes/category"));
const listRoutes = require("./routes/list");
// import db from "./models/index";
const app = (0, express_1.default)();
// モデルをdbに同期
// (async () => {
//   await db.Users.sync({ force: true });
//   await db.UserFavoriteShops.sync({ force: true });
//   await db.ShopCategories.sync({ force: true });
// })();
// view engine setup
app.set("views", path.join("views"));
app.set("view engine", "ejs");
app.use(express_1.default.static(path.join("public")));
app.use(logger("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookieParser());
// ルーティング
app.use("/login", login_1.default);
app.use("/category", category_1.default);
app.use("/list", listRoutes);
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
