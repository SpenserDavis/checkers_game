import { Request, Response, NextFunction } from "express";
import CheckersController from "./checkersController";

export interface RequestWithBody extends Request {
  body: { [key: string]: any };
}

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log("request being made");
  next();
}

export const controllers = [CheckersController];
