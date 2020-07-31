import JWT from "jsonwebtoken";
import { mailUsername, mailPassword, createPasswordSecretKey } from "./config";
import { removeKey } from "./redisClient";
import {
  INVALID_AUTH_TOKEN,
  INVALID_TOKEN,
  TOKEN_EXPIRED,
  INVALID_ID,
  UNAUTHORIZED_REQUEST,
} from "./errorConstants";
import NodeMailer, { Transporter } from "nodemailer";
import { DecryptedMessage } from "crypto-js";
import CryptoJS from "crypto-js";
import { restaurantModel } from "./models/model.index";
import { Types } from "mongoose";

export function verifyJwtToken(
  token: string,
  secretKey: string
): { status: boolean; result: string } {
  try {
    const verified = JWT.verify(token, secretKey) as {
      userId: string;
      iat: number;
      exp: number;
    };
    return { status: true, result: verified.userId };
  } catch (err) {
    return { status: false, result: INVALID_AUTH_TOKEN };
  }
}


export async function logoutRestaurant(userId: string) {
  const res = await removeKey(userId);
}

export function mailTransporter(): Transporter {
  const transporter = NodeMailer.createTransport({
    service: "gmail",
    port: 587,
    auth: { user: mailUsername, pass: mailPassword },
  });
  return transporter;
}

export const verifyEncryptedToken = async (
  token: string,
  _id: string
): Promise<{ status: boolean; data: string }> => {
  
  const bytes: DecryptedMessage = CryptoJS.AES.decrypt(
    decodeURIComponent(token),
    createPasswordSecretKey
  );
  try {
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    if (decryptedData.length === 0) return { status: false, data: INVALID_TOKEN };
    const Restaurant = restaurantModel();
    const restaurant = await Restaurant.findById(decodeURI(_id));
    if (!restaurant) return { status: false, data: INVALID_ID };
    if (restaurant.createPasswordCredentials.isValid === false)
      return { status: false, data: TOKEN_EXPIRED };
    return {
      status: true,
      data: JSON.stringify({
        email: restaurant.email,
        ownerName: restaurant.ownerName,
      }),
    };
  } catch (error) {
    return { status: false, data: INVALID_ID };
  }
};

export const validateForgotPasswordJWT = async (
  _id: string,
  token: string
): Promise<{ status: boolean; data: string }> => {
  const Restaurant = restaurantModel();
  const ObjectId = Types.ObjectId;

  try {
    const [restaurant] = (await Restaurant.aggregate([
      { $match: { _id: ObjectId(_id) } },
      { $unwind: "$admins" },
      { $match: { "admins.isOwner": true } },
      { $replaceRoot: { newRoot: "$admins" } },
      { $project: { password: 1 } },
    ])) as { password: string }[];

    if (!restaurant) return { status: false, data: UNAUTHORIZED_REQUEST };
    const verifyResult = verifyJwtToken(token, restaurant.password);
    if (verifyResult.status === false)
      return { status: false, data: UNAUTHORIZED_REQUEST };
    return { status: true, data: verifyResult.result };
  } catch (error) {
    return { status: false, data: UNAUTHORIZED_REQUEST };
  }
};
