import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocasStrategy } from "passport-local";
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
        .catch((erro) => {
          // エラー処理
          return done(null, false, {
            message: "認証情報と一致するレコードがありません",
          });
        });
    }
  )
);

// Session
passport.serializeUser((user: Express.User, done) => {
  done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

export default passport;
