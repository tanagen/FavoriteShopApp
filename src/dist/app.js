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
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Users, UsersFavoriteShopsテーブルをDrop & Create
    yield models_1.default.Users.sync({ force: true });
    yield models_1.default.UserFavoriteShops.sync({ force: true });
    // userインスタンス作成
    const user = models_1.default.Users.build({
        user_name: "gen",
        user_email: "gen@mail.com",
    });
    // userのinsert
    const registerdUser = yield user.save();
    // insertされたuserに紐づくuserFavoriteShopを作成
    yield registerdUser.createUserFavoriteShop({ favorite_shop: "ABCマート" });
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
