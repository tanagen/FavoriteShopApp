"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.factory = exports.Users = void 0;
const sequelize_1 = require("sequelize");
const TABLE_NAME = "users";
class Users extends sequelize_1.Model {
    static attach(sequelize) {
        this.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            nick_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
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
exports.Users = Users;
const factory = (sequelize) => {
    Users.attach(sequelize);
    return Users;
};
exports.factory = factory;
