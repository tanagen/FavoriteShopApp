"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
const login_1 = require("../handlers/login");
app_1.router.get("/", login_1.renderLoginPage);
app_1.router.post("/");
exports.default = app_1.router;
