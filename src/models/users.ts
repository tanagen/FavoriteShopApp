import {
  Sequelize,
  Model,
  DataTypes,
  HasManyCreateAssociationMixin,
} from "sequelize";
import UserFavoriteShops from "./userFavoriteShops";
import ShopCategories from "./shopCategories";

const TABLE_NAME = "users";

export default class Users extends Model {
  public id!: number;
  public user_name!: string;
  public user_email!: string;
  public user_password!: string;
  public created_at!: Date;
  public updated_at!: Date;

  // 作成したuserのuser_idをもつuserFavoriteShopを作成するメソッド
  public createUserFavoriteShop!: HasManyCreateAssociationMixin<UserFavoriteShops>;
  public createShopCategory!: HasManyCreateAssociationMixin<ShopCategories>;

  // 初期化
  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        user_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        user_email: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "",
          unique: true,
        },
        user_password: {
          type: DataTypes.STRING,
          allowNull: false,
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
        timestamps: true,
        underscored: true,
        sequelize: sequelize,
      }
    );
    return Users;
  }

  // テーブル関係を記述
  public static associate() {
    this.hasMany(UserFavoriteShops, {
      sourceKey: "id",
      foreignKey: "user_id", // target(UserFavoriteShops)のカラム名を指定
      constraints: false, // 制約情報(外部キー)の有効化フラグ Project.sync({ force: true })を動作させるために false に設定。
    });
    this.hasMany(ShopCategories, {
      sourceKey: "id",
      foreignKey: "user_id",
      constraints: false, // 制約情報(外部キー)の有効化フラグ Project.sync({ force: true })を動作させるために false に設定。
    });
  }
}
