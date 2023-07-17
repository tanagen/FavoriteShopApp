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
exports.login = exports.renderLoginPage = void 0;
const index_1 = __importDefault(require("../models/index"));
// ログインページの表示
const renderLoginPage = (req, res) => {
    res.render("login");
};
exports.renderLoginPage = renderLoginPage;
// ログイン
const login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    (() => __awaiter(void 0, void 0, void 0, function* () {
        yield index_1.default.Users.findAll({ where: { user_email: email } }).then((results) => {
            if (results.length > 0) {
                if (password === results[0].user_password) {
                    req.session.userId = results[0].id;
                    console.log("認証に成功しました！");
                    res.redirect("/category");
                }
                else {
                    console.log("認証に失敗しました。。。");
                    res.redirect("/login");
                }
            }
            else {
                console.log("ユーザー情報が登録されていません");
                res.redirect("./login");
            }
        });
    }))();
};
exports.login = login;
