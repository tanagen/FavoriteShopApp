"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthenticated = void 0;
// サインイン状態を判断するミドルウェア
const checkAuthenticated = (req, res, next) => {
    // passport認証を通過(サインイン)している場合はtrueを返す
    if (req.isAuthenticated()) {
        next();
    }
    else {
        next();
        res.redirect("/login");
    }
};
exports.checkAuthenticated = checkAuthenticated;
