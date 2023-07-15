"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
const category_1 = require("../handlers/category");
app_1.router.get("/", category_1.renderShopCategoryPage);
app_1.router.post("/", category_1.createShopCategory);
app_1.router.get("/create/", category_1.renderCreateCategoryPage);
module.exports = app_1.router;
