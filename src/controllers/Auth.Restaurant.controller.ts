import { Request, Response, NextFunction } from "express";
import { restaurantModel } from "../models/model.index";
import { APIError } from "../utilities/APIError";
import Bcrypt from "bcrypt";
import {
  logoutRestaurant,
  verifyEncryptedToken,
  verifyJwtToken,
  mailTransporter,
  validateForgotPasswordJWT,
} from "../helper";
import { getData, client } from "../redisClient";
import JWT from "jsonwebtoken";
import {
  jwtKeyAuth,
  tokenExpiryTime,
  jwtKeyRefreshToken,
  passwordSaltRound,
  forgotPasswordTokenExpiryTime,
  mailUsername,
} from "../config";
import {
  USER_NOT_FOUND,
  WRONG_PASSWORD,
  INVALID_REFRESH_TOKEN,
  UNAUTHORIZED_REQUEST,
  REFRESH_TOKEN_EXPIRED,
  INVALID_HEADER_VALUE,
} from "../errorConstants";

import { forgotPasswordMailSubject } from "../constants";
import { Types } from "mongoose";
import { AdminInterface } from "../interface/Restaurant.Interface";

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { email, password } = req.body as { email: string; password: string };
  const Restaurant = restaurantModel();

  const [user] = (await Restaurant.aggregate([
    { $unwind: "$admins" },
    { $match: { "admins.email": email } },
    { $replaceRoot: { newRoot: "$admins" } },
  ])) as AdminInterface[];

  if (!user) return next(new APIError(401, USER_NOT_FOUND));
  try {
    const result = await Bcrypt.compare(password, user.password);
    if (result === false) return next(new APIError(401, WRONG_PASSWORD));
    req.userId = user._id;
    logoutRestaurant(user._id);
    next();
  } catch (error) {
    next(new APIError(401, WRONG_PASSWORD));
  }
}

export async function logoutController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers as { authorization: string };
  const verifyResult = verifyJwtToken(authorization, jwtKeyRefreshToken);
  if (verifyResult.status === false)
    return next(new APIError(401, verifyResult.result));
  logoutRestaurant(verifyResult.result);
  res.send({ status: true });
}

export async function getAuthTokenFromRefreshTokenController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { refreshToken } = req.body as { refreshToken: string };
  const verifyResult = verifyJwtToken(refreshToken, jwtKeyRefreshToken);
  if (verifyResult.status === false)
    return next(new APIError(401, INVALID_REFRESH_TOKEN));

  const oldTokenString = await getData(verifyResult.result);

  if (!oldTokenString) return next(new APIError(401, UNAUTHORIZED_REQUEST));

  const oldTokens = JSON.parse(oldTokenString) as {
    authToken: string;
    refreshToken: string;
  };
  if (oldTokens.refreshToken.localeCompare(refreshToken) !== 0)
    return next(new APIError(401, REFRESH_TOKEN_EXPIRED));

  const authVerify = verifyJwtToken(oldTokens.authToken, jwtKeyAuth);
  if (authVerify.status === true) {
    logoutRestaurant(refreshToken);
    return next(new APIError(401, UNAUTHORIZED_REQUEST));
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

export async function validatePasswordTokenController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { token, _id } = req.query as { token: string; _id: string };
  const { source } = req.headers as { source: string };
  if (source === "CREATE") {
    const verifiedResult = await verifyEncryptedToken(token, _id);
    if (verifiedResult.status === false)
      return next(new APIError(401, UNAUTHORIZED_REQUEST));
    res.send({ status: true });
  } else if (source === "RESET") {
    const verifyResult = await validateForgotPasswordJWT(_id, token);
    if (verifyResult.status === false)
      return next(new APIError(401, verifyResult.data));
    res.send({ status: true });
  } else return next(new APIError(412, INVALID_HEADER_VALUE));
}

export const createPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token, _id, password } = req.body as {
    token: string;
    _id: string;
    password: string;
  };
  const verifyTokenResult = await verifyEncryptedToken(token, _id);

  if (verifyTokenResult.status === false)
    return next(new APIError(401, verifyTokenResult.data as string));
  const Restaurant = restaurantModel();
  const hashPassword = await Bcrypt.hash(password, parseInt(passwordSaltRound));
  const result: { email: string; ownerName: string } = JSON.parse(
    verifyTokenResult.data
  );
  await Restaurant.updateOne(
    { _id: decodeURI(_id) },
    {
      $push: {
        admins: {
          name: result.ownerName,
          email: result.email,
          isOwner: true,
          password: hashPassword,
          createdAt: new Date(),
          permissions: [],
        },
      },
      $set: { "createPasswordCredentials.isValid": false },
    }
  );
  res.send({ status: true });
};

export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body as { email: string };
  const Restaurant = restaurantModel();
  const [user] = (await Restaurant.aggregate([
    { $unwind: "$admins" },
    { $match: { "admins.email": email } },
    {
      $project: {
        "admins.restaurantId": "$_id",
        "admins.email": 1,
        "admins.isOwner": 1,
        "admins.password": 1,
      },
    },
    { $replaceRoot: { newRoot: "$admins" } },
  ])) as {
    restaurantId: string;
    isOwner: boolean;
    email: string;
    password: string;
  }[];
  if (!user) return next(new APIError(404, USER_NOT_FOUND));
  if (user.isOwner === false)
    return next(new APIError(401, UNAUTHORIZED_REQUEST));
  const jwt = JWT.sign({ userId: user.email }, user.password, {
    expiresIn: 60 * parseInt(forgotPasswordTokenExpiryTime),
  });
  const mailer = mailTransporter();
  await mailer.sendMail({
    from: mailUsername,
    to: [user.email],
    subject: forgotPasswordMailSubject,
    html: `?token=${jwt}&_id=${user.restaurantId}`,
  });
  res.send({ status: true });
};

export const resetOwnerPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token, _id, newPassword } = req.body as {
    token: string;
    _id: string;
    newPassword: string;
  };
  const verifyRes = await validateForgotPasswordJWT(_id, token);
  if (verifyRes.status === false)
    return next(new APIError(401, verifyRes.data));
  const Restaurant = restaurantModel();
  const hash = await Bcrypt.hash(newPassword, parseInt(passwordSaltRound));
  const result = await Restaurant.updateOne(
    { _id: Types.ObjectId(_id), "admins.email": verifyRes.data },
    { $set: { "admins.$.password": hash } }
  );
  res.send({ status: true });
};
