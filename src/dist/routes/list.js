"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
const list_1 = require("../handlers/list");
app_1.router.get("/:index", list_1.getSelectedCategory, list_1.renderListPage);
app_1.router.post("/:index");
app_1.router.get("/:index/create", list_1.getSelectedCategory, list_1.renderCreateListPage);
module.exports = app_1.router;
