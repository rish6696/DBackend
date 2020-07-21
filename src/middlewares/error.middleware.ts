import { Response, Request, NextFunction } from "express";
import { APIError } from "../utilities/APIError";

export const errorHandler = (
  error: APIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error.status).send({
    error: {
      status: error.status,
      message: error.message,
    },
  });
};
