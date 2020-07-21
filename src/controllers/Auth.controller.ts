import { Request, Response, NextFunction } from "express";
import { restaurantModel } from "../models/model.index";
import { LoginRestaurantInterface } from "../interface/Auth.interface";
import { APIError } from "../utilities/APIError";
import { verifyToken, logoutRestaurant } from "../helper";
import { getData, client } from "../redisClient";
import JWT from "jsonwebtoken";
import { jwtKeyAuth, tokenExpiryTime } from "../config";

export async function loginRestaurantController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  const { username, password } = req.body as LoginRestaurantInterface;
  const Restaurant = restaurantModel();

  const user = await Restaurant.aggregate([
    { $unwind: "$admins" },
    { $match: { "admins.username": username } },
    { $replaceRoot: { newRoot: "$admins" } },
  ]);

  if (!user || user.length == 0)
    return next(new APIError(401, "User not Found"));
  //const result = await Bcrypt.compare( password , user[0].password);
  if (password.localeCompare(user[0].password) !== 0)
    next(new APIError(401, "Wrong Password"));
  req.userId = user[0]._id;
  logoutRestaurant(user[0]._id);
  next();
}

export async function logoutRestaurantController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logoutRestaurant(req.userId);
  res.send({ status: true });
}

export async function getAuthTokenFromRefreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { refreshToken } = req.body as { refreshToken: string };
  const verifyResult = verifyToken(refreshToken, false);
  if (verifyResult.status === false)
    return next(new APIError(401, "Invalid refresh Token"));

  const oldTokenString = await getData(verifyResult.result);

  if (!oldTokenString) return next(new APIError(401, "Unauthorized request"));

  const oldTokens = JSON.parse(oldTokenString) as {
    authToken: string;
    refreshToken: string;
  };
  if (oldTokens.refreshToken.localeCompare(refreshToken) !== 0)
    return next(new APIError(401, "Refresh Token Expired"));

  const authVerify = verifyToken(oldTokens.authToken, true);
  if (authVerify.status === true) {
    logoutRestaurant(refreshToken);
    return next(new APIError(401, "Unauthorized Request"));
  }
  const authTokenNew = JWT.sign(
    { userId: verifyResult.result },
    jwtKeyAuth as string,
    { expiresIn: 60 * parseInt(tokenExpiryTime) }
  );
  client.set(
    verifyResult.result,
    JSON.stringify({ authToken: authTokenNew, refreshToken })
  );
  res.send({ refreshToken, authToken: authTokenNew });
}
