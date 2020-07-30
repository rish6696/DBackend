import { Response, Request, NextFunction } from "express";
import { restaurantModel } from "../models/model.index";
import { mailTransporter, verifyEncryptedToken } from "../helper";
import {
  mailUsername,
  createPasswordSecretKey,
  passwordSaltRound,
} from "../config";
import {
  createPasswordMailSubject,
  createPasswordMailHtml,
} from "../constants";
import CryptoJS from "crypto-js";

export async function createRestaurant(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const Restaurant = restaurantModel();
  const restaurant = new Restaurant(req.body);
  const savedRestaurant = await restaurant.save();

  res.send({ status: true });

  const passwordCode: string = Date.now() + savedRestaurant._id;
  await Restaurant.updateOne(
    { _id: savedRestaurant._id },
    {
      $set: {
        "createPasswordCredentials.code": passwordCode,
        "createPasswordCredentials.isValid": true,
      },
    }
  );
  const data = passwordCode;

  const cipherText = CryptoJS.AES.encrypt(
    data,
    createPasswordSecretKey
  ).toString();

  const mailer = mailTransporter();
  await mailer.sendMail({
    from: mailUsername,
    to: [savedRestaurant.email],
    subject: createPasswordMailSubject,
    html: createPasswordMailHtml(
      cipherText,
      savedRestaurant.restaurantLogo,
      savedRestaurant._id
    ),
  });
}

export async function getSomePrivateData(req: Request, res: Response) {
  res.send({ userId: req.userId, description: "This is some protected info" });
}

export async function publicRoute(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.send("this is the public route");
}
