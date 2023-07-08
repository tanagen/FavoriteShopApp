"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
const category_1 = require("../handlers/category");
app_1.router.get("/", category_1.renderCategoryPage);
app_1.router.post("/");
module.exports = app_1.router;
