import express, { Router } from "express";
import {
  loginRestaurantController,
  getAuthTokenFromRefreshToken,
  logoutRestaurantController,
} from "../controllers/Auth.controller";
import { createValidator, ExpressJoiInstance } from "express-joi-validation";
import {
  loginRestaurantValidator,
  refreshTokenRequestValidator,
  protectedRoutesValidator,
} from "../validators/Auth.validator";
import { assignJWT, authenticateJWT } from "../middlewares/auth.middlewares";

const validator: ExpressJoiInstance = createValidator({});

export const authRouter: Router = express.Router();

authRouter
  .route("/logoutRestaurant")
  .post(
    validator.headers(protectedRoutesValidator),
    authenticateJWT,
    logoutRestaurantController
  );

authRouter
  .route("/refreshAuthToken")
  .post(
    validator.body(refreshTokenRequestValidator),
    getAuthTokenFromRefreshToken
  );

authRouter
  .route("/loginRestaurant")
  .post(
    validator.body(loginRestaurantValidator),
    loginRestaurantController,
    assignJWT
  );
