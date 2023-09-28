import path from "path";
import * as dotenv from "dotenv"; // dotenvモジュールは.envファイルに定義された値を環境変数として使える
const MYSQL_ENV_PATH = path.join(__dirname, "../../../app.env");
dotenv.config({ path: MYSQL_ENV_PATH.slice(1) }); // pathの設定方法が腑に落ちないが、envファイル名を記載すると正常に読み込んでくれる
import { Sequelize, Model } from "sequelize";
import Users from "./users";
import UserMemos from "./userMemos";
import ShopCategories from "./shopCategories";
// import { database, username, userpassword } from "../mysqlConfig.js";

interface DB {
  database: string;
  username: string;
  userpassword: string;
}

// mysqlの設定定義
const dbConfig: DB = {
  database: process.env.MYSQL_DATABASE,
  username: process.env.MYSQL_USER,
  userpassword: process.env.MYSQL_PASSWORD,
};

// mysql環境変数を取得して変数に格納
// const database = process.env.MYSQL_DATABASE!;
// const username = process.env.MYSQL_USER!;
// const userpassword = process.env.MYSQL_PASSWORD!;
// console.log(database, username, userpassword);
// console.log(process.env);

// sequelizeインスタンスの作成
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.userpassword,
  {
    host: "mysql", // docker-compose.ymlで設定したDBコンテナのコンテナ名mysqlに変更
    dialect: "mysql", //ここはmysql固定
  }
);

// モデルを一つのオブジェクトにまとめる
const db = {
  Users: Users.initialize(sequelize),
  UserMemos: UserMemos.initialize(sequelize),
  ShopCategories: ShopCategories.initialize(sequelize),
};

// テーブル同士の関係を作成する
Object.keys(db).forEach((tableName) => {
  if (
    tableName === "Users" ||
    tableName === "UserMemos" ||
    tableName === "ShopCategories"
  ) {
    const model = db[tableName];
    if (model.associate) {
      model.associate();
    }
  }
});

export default db;
