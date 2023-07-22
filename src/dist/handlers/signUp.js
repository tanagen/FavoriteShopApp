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
exports.signUp = exports.renderSignUpPage = void 0;
const index_1 = __importDefault(require("../models/index"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const renderSignUpPage = (req, res) => {
    res.render("signUp");
};
exports.renderSignUpPage = renderSignUpPage;
const signUp = (req, res) => {
    // formでpostされたuser情報を取得
    const createdUserName = req.body.username;
    const createdEmail = req.body.email;
    const createdPassword = bcrypt_1.default.hashSync(req.body.password, bcrypt_1.default.genSaltSync(8));
    // 取得したuser情報をusersDBに格納
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const t = yield index_1.default.Users.sequelize.transaction();
        try {
            yield index_1.default.Users.create({
                user_name: createdUserName,
                user_email: createdEmail,
                user_password: createdPassword,
            });
            yield (t === null || t === void 0 ? void 0 : t.commit);
        }
        catch (error) {
            console.log(error);
            yield (t === null || t === void 0 ? void 0 : t.rollback());
        }
        // redirect
        res.redirect("/login");
    }))();
};
exports.signUp = signUp;
