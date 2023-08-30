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
            shop_location: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: "",
            },
            shop_description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
                defaultValue: "",
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
                defaultValue: sequelize_1.Sequelize.literal("CURRENT_TIMESTAMP"),
                allowNull: false,
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
                defaultValue: sequelize_1.Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
                allowNull: false,
            },
        }, {
            tableName: TABLE_NAME,
            underscored: true,
            timestamps: true,
            sequelize: sequelize,
        });
        return UserFavoriteShops;
    }
    static associate() {
        this.belongsTo(users_1.default, {
            foreignKey: "user_id",
            targetKey: "id",
            constraints: false,
        });
    }
}
exports.default = UserFavoriteShops;
