"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const top_1 = __importDefault(require("./routes/top"));
const login_1 = __importDefault(require("./routes/login"));
const signUp_1 = __importDefault(require("./routes/signUp"));
const category_1 = __importDefault(require("./routes/category"));
const list_1 = __importDefault(require("./routes/list"));
const logout_1 = __importDefault(require("./routes/logout"));
const express_session_1 = __importDefault(require("express-session"));
const auth_1 = __importDefault(require("./auth"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const app = (0, express_1.default)();
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
app.set("views", path_1.default.join("views"));
app.set("view engine", "ejs");
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join("public")));
app.use((0, connect_flash_1.default)());
// sessionの設定
app.use((0, express_session_1.default)({
    secret: "my_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 30, // セッションの消滅時間。単位はミリ秒。30分と指定。
    },
}));
// passportの初期化
app.use(auth_1.default.initialize());
// sessionが有効な間、リクエストのたびにデシリアライズを実行し、req.userの更新を行う
app.use(auth_1.default.session());
// ルーティング
app.use("/", top_1.default);
app.use("/login", login_1.default);
app.use("/signUp", signUp_1.default);
app.use("/logout", logout_1.default);
app.use("/category", category_1.default);
app.use("/list", list_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
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
