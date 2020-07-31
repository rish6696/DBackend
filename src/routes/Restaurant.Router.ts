import express, { Router } from "express";
import {
  createRestaurantController
} from "../controllers/RestaurantManagement.controller";
import { createValidator, ExpressJoiInstance } from "express-joi-validation";
import { createRestaurantValidator } from "../validators/Restaurant.validator";

const validator: ExpressJoiInstance = createValidator({});

export const restaurantRoute: Router = express.Router();

restaurantRoute
  .route("/create")
  .post(validator.body(createRestaurantValidator), createRestaurantController);
