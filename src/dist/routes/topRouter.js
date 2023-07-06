"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
const top_1 = require("../handlers/top");
app_1.router.get("/", top_1.renderTopPage);
app_1.router.post("/");
module.exports = app_1.router;
