// src/middlewares/errors.middleware.ts

import { Request, Response, NextFunction } from "express";
import { AppError, handleError } from "../errors/appErrors";

const errorsMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _: NextFunction
) => {
  if (err instanceof AppError) {
    return handleError(err, res);
  }

  return res.status(500).json({ message: "Internal server error" });
};

export default errorsMiddleware;
