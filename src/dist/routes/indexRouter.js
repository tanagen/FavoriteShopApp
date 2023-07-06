"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
/* GET home page. */
app_1.router.get("/", function (req, res, next) {
    res.render("index", { title: "Express" });
});
module.exports = app_1.router;
