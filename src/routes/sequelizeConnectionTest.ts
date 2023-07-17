// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;

// const express = require("express");
// import { router } from "../app";

// // sequelizeの設定を追加
// const { Sequelize } = require("sequelize");
// // databaseやuser, passwordをdcoker-compose.ymlで設定したものを使う↓
// const sequelize = new Sequelize("favorite_shop", "root", "root", {
//   host: "mysql", // hostの名前をdocker-compose.ymlで設定したmysqlに変更
//   dialect: "mysql",
// });

// /* GET users listing. */
// // router.get("/", async (req: any, res: any, next: any) => {
// //   // 忘れずに上に"async"を追加する。
// //   // my_mysqlに接続されているかテスト
// //   try {
// //     await sequelize.authenticate();
// //     console.log("Connection has been established successfully.");
// //   } catch (error) {
// //     console.error("Unable to connect to the database:", error);
// //   }
// //   res.send("respond with a resource!!!");
// // });

// module.exports = router;
