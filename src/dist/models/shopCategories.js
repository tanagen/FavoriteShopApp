"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const users_1 = __importDefault(require("./users"));
const TABLE_NAME = "shop_categories";
class ShopCategories extends sequelize_1.Model {
    // user_idとshop_categoryをunique keyに設定して複合ユニーク制約にすることで、
    // 各カラムの値の組み合わせが同一のレコードを追加できなくする
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
                allowNull: false,
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
        return ShopCategories;
    }
    static associate() {
        this.belongsTo(users_1.default, {
            foreignKey: "user_id",
            targetKey: "id",
            constraints: false,
        });
    }
}
exports.default = ShopCategories;
