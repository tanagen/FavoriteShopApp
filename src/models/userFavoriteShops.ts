import { Sequelize, Model, DataTypes } from "sequelize";
import { Users } from "./users";

const TABLE_NAME = "user_favorite_shops";

class UserFavoriteShops extends Model {
  public id!: number;
  public user_id!: number;
  public shop_info!: string;
  public created_at!: Date;
  public updated_at!: Date;

  public static attach(sequelize: Sequelize): void {
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
        shop_info: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: "",
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        tableName: TABLE_NAME,
        underscored: true,
        sequelize: sequelize,
      }
    );
  }
}

const factory = (sequelize: Sequelize) => {
  UserFavoriteShops.attach(sequelize);

  return UserFavoriteShops;
};

export { UserFavoriteShops, factory };
