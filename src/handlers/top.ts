import { Request, Response } from "express";

export const renderTopPage = (req: Request, res: Response) => {
  res.render("top");
};
