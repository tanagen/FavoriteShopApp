import { Sequelize, Model } from "sequelize";
import Users from "./users";
import UserFavoriteShops from "./userFavoriteShops";
import {
  database,
  username,
  userpassword,
  host,
  dialect,
  rootname,
  rootpassword,
} from "../mysqlConfig.js";

console.log(host);

// sequelizeインスタンスの作成
const sequelize = new Sequelize(database, username, userpassword, {
  host: host,
  dialect: dialect,
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
