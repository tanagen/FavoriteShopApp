import { Request, Response } from "express";

export const renderSignUpPage = (req: Request, res: Response) => {
  res.render("signUp");
};
