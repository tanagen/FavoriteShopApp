import db from "../models/index";
import { Request, Response } from "express";

export const renderLoginPage = (req: Request, res: Response) => {
  res.render("login");
};
