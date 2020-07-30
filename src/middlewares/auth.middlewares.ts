import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import {
  jwtKeyAuth,
  jwtKeyRefreshToken,
  tokenExpiryTime,
  createPasswordSecretKey,
} from "../config";
import { client } from "../redisClient";
import { verifyJwtToken } from "../helper";
import { APIError } from "../utilities/APIError";

export async function assignJWT(req: Request, res: Response) {
  const { userId } = req;
  const authToken = JWT.sign({ userId }, jwtKeyAuth, {
    expiresIn: 60 * parseInt(tokenExpiryTime),
  });
  const refreshToken = JWT.sign({ userId }, jwtKeyRefreshToken);
  client.set(userId.toString(), JSON.stringify({ refreshToken, authToken }));
  res.send({ authToken, refreshToken });
}

export async function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers as { authorization: string };
  const jwtSecretKey: string =
    req.path.localeCompare("/logoutRestaurant") === 0
      ? jwtKeyRefreshToken
      : jwtKeyAuth;
  const verifyResult = verifyJwtToken(authorization, jwtSecretKey);
  if (verifyResult.status === true) {
    req.userId = verifyResult.result;
    return next();
  }
  next(new APIError(401, verifyResult.result));
}
