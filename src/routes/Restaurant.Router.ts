import express, { Router } from "express";
import {
  createRestaurant,
  getSomePrivateData,
  publicRoute,
} from "../controllers/RestaurantManagement.controller";
import { createValidator, ExpressJoiInstance } from "express-joi-validation";
import { createRestaurantValidator } from "../validators/Restaurant.validator";
import { protectedRoutesValidator } from "../validators/Auth.validator";
import { authenticateJWT } from "../middlewares/auth.middlewares";

const validator: ExpressJoiInstance = createValidator({});

export const restaurantRoute: Router = express.Router();

restaurantRoute.route("/public").get(publicRoute);

restaurantRoute
  .route("/getPrivateData")
  .get(
    validator.headers(protectedRoutesValidator),
    authenticateJWT,
    getSomePrivateData
  );

restaurantRoute
  .route("/create")
  .post(validator.body(createRestaurantValidator), createRestaurant);
