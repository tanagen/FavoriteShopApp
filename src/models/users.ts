import { Sequelize, Model, DataTypes } from "sequelize";
import { UserFavoriteShops } from "./userFavoriteShops";

const TABLE_NAME = "users";

class Users extends Model {
  public id!: number;
  public nick_name!: string;
  public email!: string;
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
        nick_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
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
  Users.attach(sequelize);

  return Users;
};

export { Users, factory };
