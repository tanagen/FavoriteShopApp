import { Request, Response } from "express";
import db from "../models/index";
import session from "express-session";

// アンビエント宣言内に使用したいオブジェクトを追加することでTypeScriptにも対応
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

// ログインページの表示
export const renderLoginPage = (req: Request, res: Response) => {
  res.render("login");
};

// ログイン
export const login = (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  (async () => {
    await db.Users.findAll({ where: { user_email: email } }).then((results) => {
      if (results.length > 0) {
        if (password === results[0].user_password) {
          req.session.userId = results[0].id;
          console.log("認証に成功しました！");
          res.redirect("/category");
        } else {
          console.log("認証に失敗しました。。。");
          res.redirect("/login");
        }
      } else {
        console.log("ユーザー情報が登録されていません");
        res.redirect("./login");
      }
    });
  })();
};
