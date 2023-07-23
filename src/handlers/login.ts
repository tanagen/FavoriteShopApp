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
