import { Request, Response } from "express";
import db from "../models/index";
import bcrypt from "bcrypt";

export const renderSignUpPage = (req: Request, res: Response) => {
  res.render("signUp");
};

export const signUp = (req: Request, res: Response) => {
  // formでpostされたuser情報を取得
  const createdUserName = req.body.username;
  const createdEmail = req.body.email;
  const createdPassword = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(8)
  );

  // 取得したuser情報をusersDBに格納
  (async () => {
    const t = await db.Users.sequelize!.transaction();

    try {
      await db.Users.create({
        user_name: createdUserName,
        user_email: createdEmail,
        user_password: createdPassword,
      });

      await t?.commit;
    } catch (error) {
      console.log(error);
      await t?.rollback();
    }

    // redirect
    res.redirect("/login");
  })();
};
