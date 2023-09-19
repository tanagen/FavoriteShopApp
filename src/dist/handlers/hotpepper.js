"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHotPepperApiKey = void 0;
const getHotPepperApiKey = (req, res, next) => {
    res.locals.hotpepperApiKey = process.env.HOT_PEPPER_API_KEY;
    next();
};
exports.getHotPepperApiKey = getHotPepperApiKey;
