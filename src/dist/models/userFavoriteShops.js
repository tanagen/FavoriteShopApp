"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const users_1 = __importDefault(require("./users"));
const TABLE_NAME = "user_favorite_shops";
class UserFavoriteShops extends sequelize_1.Model {
    static initialize(sequelize) {
        this.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            shop_category: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: "",
            },
            shop_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: "",
            },
        }, {
            tableName: TABLE_NAME,
            underscored: true,
            sequelize: sequelize,
        });
        return UserFavoriteShops;
    }
    static associate() {
        this.belongsTo(users_1.default, { foreignKey: "user_id", constraints: false });
    }
}
exports.default = UserFavoriteShops;
