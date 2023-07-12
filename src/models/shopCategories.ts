import { Sequelize, Model, DataTypes } from "sequelize";
import Users from "./users";

const TABLE_NAME = "shop_categories";

export default class ShopCategories extends Model {
  public id!: number;
  public user_id!: number;
  public shop_category!: string;
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
          allowNull: false,
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

    return ShopCategories;
  }

  public static associate() {
    this.belongsTo(Users, {
      foreignKey: "user_id",
      targetKey: "id",
      constraints: false,
    });
  }
}
