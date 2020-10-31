import express, { Router } from "express";
import {
  loginController,
  getAuthTokenFromRefreshTokenController,
  logoutController,
  validatePasswordTokenController,
  createPasswordController,
  forgotPasswordController,
  resetOwnerPasswordController,
} from "../controllers/Auth.Restaurant.controller";
import { createValidator, ExpressJoiInstance } from "express-joi-validation";
import {
  loginValidator,
  refreshTokenRequestValidator,
  protectedRoutesValidator,
  validatePasswordQueryValidator,
  validatePasswordHeaderValidator,
  createRestaurantPasswordValidator,
  forgotPasswordValidator,
  resetOwnerPasswordValidator,
} from "../validators/Auth.restaurant.validator";
import { assignJWT } from "../middlewares/auth.middlewares";

const validator: ExpressJoiInstance = createValidator({});

export const authRestaurantRouter: Router = express.Router();

authRestaurantRouter
  .route("/resetPassword/owner")
  .post(
    validator.body(resetOwnerPasswordValidator),
    resetOwnerPasswordController
  );

authRestaurantRouter
  .route("/forgotPassword")
  .post(validator.body(forgotPasswordValidator), forgotPasswordController);

authRestaurantRouter
  .route("/createPassword")
  .post(
    validator.body(createRestaurantPasswordValidator),
    createPasswordController
  );

authRestaurantRouter
  .route("/validatePasswordToken")
  .get(
    validator.query(validatePasswordQueryValidator),
    validator.headers(validatePasswordHeaderValidator),
    validatePasswordTokenController
  );

authRestaurantRouter
  .route("/logout")
  .post(validator.headers(protectedRoutesValidator), logoutController);

authRestaurantRouter
  .route("/refreshAuthToken")
  .post(
    validator.body(refreshTokenRequestValidator),
    getAuthTokenFromRefreshTokenController
  );

authRestaurantRouter
  .route("/login")
  .post(validator.body(loginValidator), loginController, assignJWT);
