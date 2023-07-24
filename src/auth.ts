import bcrypt from "bcrypt";
import passport from "passport";
const LocasStrategy = require("passport-local").Strategy; // importで読み込むと型定義ファイルが見つからないエラーになる
import db from "./models/index";

// 認証処理
passport.use(
  new LocasStrategy(
    {
      // デフォルトパラメータ名をオーバーライド
      usernameField: "email",
      passwordField: "password",
    },
    (email: any, password: any, done: any) => {
      // postのnameタグから取得したemailを指定してUsersDBにアクセス
      db.Users.findOne({
        where: { user_email: email },
      })
        .then((user) => {
          // userが存在したらパスワードが一致するかチェック
          if (user && bcrypt.compareSync(password, user.user_password)) {
            return done(null, user); // ログイン成功
          }

          throw new Error();
        })
        .catch((error) => {
          // エラー処理
          return done(null, false, {
            message: "認証情報と一致するレコードがありません",
          });
        });
    }
  )
);

// serializeUserやdeserializeUserはsessionに登録したり、sessionから取り出したりするのに利用
// serializeUser:ユーザーオブジェクト(user)を渡してsessionの保存に成功したらdoneの第2引数でuserを返す
passport.serializeUser((user: Express.User, done) => {
  done(null, user);
});

// IDからユーザー情報を特定し、req.userに保存する
passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

export default passport;
