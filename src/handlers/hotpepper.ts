import { Request, Response, NextFunction } from "express";

export const getHotPepperApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.hotpepperApiKey = process.env.HOT_PEPPER_API_KEY;

  next();
};
