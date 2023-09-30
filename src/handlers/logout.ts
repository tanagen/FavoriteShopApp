import { NextFunction, Request, Response } from "express";

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((error) => {
    if (error) {
      console.log(error);
      return next(error);
    }
    res.redirect("/login");
  });
};
