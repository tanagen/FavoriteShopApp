"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const userFavoriteShops_1 = __importDefault(require("./userFavoriteShops"));
const TABLE_NAME = "users";
class Users extends sequelize_1.Model {
    // 初期化
    static initialize(sequelize) {
        this.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            user_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            user_email: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                defaultValue: "",
                unique: true,
            },
        }, {
            tableName: TABLE_NAME,
            underscored: true,
            sequelize: sequelize,
        });
        return Users;
    }
    // テーブル関係を記述
    static associate() {
        this.hasMany(userFavoriteShops_1.default, {
            sourceKey: "id",
            foreignKey: "user_id",
            constraints: false, // 制約情報(外部キー)の有効化フラグ Project.sync({ force: true })を動作させるために false に設定。
        });
    }
}
exports.default = Users;
