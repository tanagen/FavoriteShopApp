import { NextFunction, Request, Response } from "express";
import passport from "passport";

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/login");
  });
};
