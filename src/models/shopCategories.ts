import { Sequelize, Model, DataTypes } from "sequelize";
import Users from "./users";

const TABLE_NAME: string = "shop_categories";

export default class ShopCategories extends Model {
  public id!: number;
  public user_id!: number;
  public shop_category!: string;
  public created_at!: Date;
  public updated_at!: Date;

  // user_idとshop_categoryをunique keyに設定して複合ユニーク制約にすることで、
  // 各カラムの値の組み合わせが同一のレコードを追加できなくする
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
      constraints: false, // 「制約」 制約情報(外部キー)の有効化フラグ Project.sync({ force: true })を動作させるために false に設定。
    });
  }
}
