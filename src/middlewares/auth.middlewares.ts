import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import { jwtKeyAuth, jwtKeyRefreshToken, tokenExpiryTime } from "../config";
import { client } from "../redisClient";

export async function assignJWT(req: Request, res: Response) {
  const { userId } = req;
  const authToken = JWT.sign({ userId }, jwtKeyAuth, {
    expiresIn: 60 * parseInt(tokenExpiryTime),
  });
  const refreshToken = JWT.sign({ userId }, jwtKeyRefreshToken);
  client.set(userId.toString(), JSON.stringify({ refreshToken, authToken }));
  res.send({ authToken, refreshToken });
}
