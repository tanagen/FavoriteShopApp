import { Sequelize, Model } from "sequelize";
import Users from "./users";
import UserFavoriteShops from "./userFavoriteShops";
// const {
//   database,
//   username,
//   userpassword,
//   host,
//   dialect,
// } = require("../../mysql/mysqlConfig");

// import {
//   database,
//   username,
//   userpassword,
//   host,
//   dialect,
// } from "../../mysql/mysqlConfig";

// sequelizeインスタンスの作成
const sequelize = new Sequelize("favorite_shop", "root", "root", {
  host: "mysql",
  dialect: "mysql",
});

// モデルを一つのオブジェクトにまとめる
const db = {
  Users: Users.initialize(sequelize),
  UserFavoriteShops: UserFavoriteShops.initialize(sequelize),
};

// テーブル同士の関係を作成する
Object.keys(db).forEach((tableName) => {
  if (tableName === "Users" || tableName === "UserFavoriteShops") {
    const model = db[tableName];
    if (model.associate) {
      model.associate();
    }
  }
});

export default db;
