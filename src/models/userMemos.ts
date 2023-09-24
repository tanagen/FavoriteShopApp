import { Sequelize, Model, DataTypes } from "sequelize";
import Users from "./users";

const TABLE_NAME = "user_memos";

export default class UserMemos extends Model {
  public id!: number;
  public user_id!: number;
  public shop_category!: string;
  public shop_name!: string;
  public shop_location!: string;
  public shop_description!: string;
  public created_at!: Date;
  public updated_at!: Date;

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
        shop_category: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: "",
        },
        shop_name: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: "",
        },
        shop_location: {
          type: DataTypes.JSON,
          allowNull: true,
          defaultValue: "",
        },
        shop_hotpepperlink: {
          type: DataTypes.TEXT,
          allowNull: true,
          defaultValue: "",
        },
        shop_description: {
          type: DataTypes.TEXT,
          allowNull: true,
          defaultValue: "",
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE,
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
          ),
          allowNull: false,
        },
      },
      {
        tableName: TABLE_NAME,
        underscored: true,
        timestamps: true,
        sequelize: sequelize,
      }
    );

    return UserMemos;
  }

  public static associate() {
    this.belongsTo(Users, {
      foreignKey: "user_id",
      targetKey: "id", // targetのUsersテーブルのカラム名を指定
      constraints: false,
    });
  }
}
