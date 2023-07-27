import { Request, Response, NextFunction } from "express";
import db from "../models/index";
import bcrypt from "bcrypt";

export const renderSignUpPage = (req: Request, res: Response) => {
  res.render("signUp", { userName: "", email: "", errors: {} });
};

export const signUp = (req: Request, res: Response) => {
  // formでpostされたuser情報を取得
  const createdUserName = req.body.userName;
  const createdEmail = req.body.email;
  const createdPassword = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(8)
  );
  console.log(createdEmail, createdEmail, createdPassword);

  // 取得したuser情報をusersDBに格納
  (async () => {
    // const t = await db.Users.sequelize!.transaction();

    try {
      await db.Users.create({
        user_name: createdUserName,
        user_email: createdEmail,
        user_password: createdPassword,
      });

      // await t?.commit;
    } catch (error) {
      console.log(error);
      // await t?.rollback();
    }

    // redirect
    res.redirect("/login");
  })();
};

// user新規登録における入力値の空チェック
export const checkPostedNewUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // postされた内容を変数に代入
  const postedUserName = req.body.userName;
  const postedEmail = req.body.email;
  const postedPassword = req.body.password;

  // error文格納用の配列
  const errors: { [key: string]: string } = {};

  // errorチェック
  if (postedUserName === "") {
    errors["userName"] = "入力してください";
  }
  if (postedEmail === "") {
    errors["email"] = "入力してください";
  }
  if (postedPassword === "") {
    errors["password"] = "入力してください";
  }

  if (Object.keys(errors).length > 0) {
    res.render("signUp", {
      userName: postedUserName,
      email: postedEmail,
      errors: errors,
    });
  } else {
    next();
  }
};
