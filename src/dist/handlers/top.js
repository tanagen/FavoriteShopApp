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
exports.renderTopPage = void 0;
const models_1 = __importDefault(require("../models"));
// select
const tst = () => __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield models_1.default.UserFavoriteShops.findAll({
        attributes: ["user_id", "shop_category"],
    });
    rows.forEach((row) => {
        const user_id = row.user_id;
        const shop_category = row.shop_category;
        console.log(user_id, shop_category);
        // return { user_id, shop_category };
    });
});
tst;
console.log(tst);
// });
// console.log(userFavoriteShops.user_id);
// const categories = userFavoriteShops;
const categories = ["飲食", "美容"];
// const username = [""];
const renderTopPage = (req, res) => {
    res.render("top", { categories: categories });
};
exports.renderTopPage = renderTopPage;
