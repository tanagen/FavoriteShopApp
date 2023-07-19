import { Request, Response } from "express";
import db from "../models/index";
import session from "express-session";
import passport from "passport";

// エラー回避用のアンビエント宣言
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

// ログインページの表示
export const renderLoginPage = (req: Request, res: Response) => {
  // ログインに失敗したときのエラーメッセージをsessionから取得
  const errorMessage = req.flash("error").join("<br>");
  res.render("login", { errorMessage: errorMessage });
};

// ログイン
export const login = passport.authenticate("local", {
  successRedirect: "./category",
  failureRedirect: "./login",
  failureFlash: "「メールアドレス」もしくは「パスワード」が誤っています。",
});

// const email = req.body.email;
// const password = req.body.password;

// (async () => {
//   await db.Users.findAll({ where: { user_email: email } }).then((results) => {
//     if (results.length > 0) {
//       if (password === results[0].user_password) {
//         req.session.userId = results[0].id;
//         console.log("認証に成功しました！");
//         res.redirect("/category");
//       } else {
//         console.log("認証に失敗しました。。。");
//         res.redirect("/login");
//       }
//     } else {
//       console.log("ユーザー情報が登録されていません");
//       res.redirect("./login");
//     }
//   });
// })();
