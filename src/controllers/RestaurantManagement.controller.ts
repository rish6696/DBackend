import { Response, Request, NextFunction } from "express";
import { restaurantModel } from "../models/model.index";

export async function createRestaurant(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const Restaurant = restaurantModel();
  const restaurant = new Restaurant(req.body);
  const savedRestaurant = await restaurant.save();
  res.send(savedRestaurant);
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
