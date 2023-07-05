import { Sequelize, Model, DataTypes } from "sequelize";
import Users from "./users";

const TABLE_NAME = "user_favorite_shops";

export default class UserFavoriteShops extends Model {
  public id!: number;
  public user_id!: number;
  public favorite_shop!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        favorite_shop: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: "",
        },
      },
      {
        tableName: TABLE_NAME,
        underscored: true,
        sequelize: sequelize,
      }
    );

    return UserFavoriteShops;
  }

  public static associate() {
    this.belongsTo(Users, { foreignKey: "user_id", constraints: false });
  }
}
