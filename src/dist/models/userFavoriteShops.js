"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.factory = exports.UserFavoriteShops = void 0;
const sequelize_1 = require("sequelize");
const TABLE_NAME = "user_favorite_shops";
class UserFavoriteShops extends sequelize_1.Model {
    static attach(sequelize) {
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
            shop_info: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: "",
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
        }, {
            tableName: TABLE_NAME,
            underscored: true,
            sequelize: sequelize,
        });
    }
}
exports.UserFavoriteShops = UserFavoriteShops;
const factory = (sequelize) => {
    UserFavoriteShops.attach(sequelize);
    return UserFavoriteShops;
};
exports.factory = factory;
