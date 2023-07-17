"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const category_1 = require("../handlers/category");
router.get("/", category_1.renderShopCategoryPage);
router.post("/", category_1.createShopCategory);
router.get("/create/", category_1.renderCreateCategoryPage);
exports.default = router;
