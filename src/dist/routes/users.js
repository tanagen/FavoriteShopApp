"use strict";
// var express = require('express');
// var router = express.Router();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
// module.exports = router;
var express = require("express");
var router = express.Router();
// sequelizeの設定を追加
const { Sequelize } = require("sequelize");
// databaseやuser, passwordをdcoker-compose.ymlで設定したものを使う↓
const sequelize = new Sequelize("favorite_shop", "root", "root", {
    host: "mysql",
    dialect: "mysql",
});
/* GET users listing. */
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 忘れずに上に"async"を追加する。
    // my_mysqlに接続されているかテスト
    try {
        yield sequelize.authenticate();
        console.log("Connection has been established successfully.");
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
    res.send("respond with a resource!!!");
}));
module.exports = router;
