"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
const logout = (req, res, next) => {
    req.logout((error) => {
        if (error) {
            console.log(error);
            return next(error);
        }
        res.redirect("/login");
    });
};
exports.logout = logout;
