import {
  Sequelize,
  Model,
  DataTypes,
  HasManyCreateAssociationMixin,
} from "sequelize";
import UserFavoriteShops from "./userFavoriteShops";

const TABLE_NAME = "users";

export default class Users extends Model {
  public id!: number;
  public user_name!: string;
  public user_email!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // 作成したuserのuser_idをもつuserFavoriteShopsを作成するメソッド
  public createUserFavoriteShop!: HasManyCreateAssociationMixin<UserFavoriteShops>;

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
        },
        // created_at: {
        //   type: DataTypes.DATE,
        //   allowNull: false,
        // },
        // updated_at: {
        //   type: DataTypes.DATE,
        //   allowNull: false,
        // },,,
      },
      {
        tableName: TABLE_NAME,
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
      foreignKey: "user_id",
      constraints: false, // 制約情報(外部キー)の有効化フラグ Project.sync({ force: true })を動作させるために false に設定。
    });
  }
}

// const factory = (sequelize: Sequelize) => {
//   Users.initialize(sequelize);

//   return Users;
// };

// export default { Users };
