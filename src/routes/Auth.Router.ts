import express, { Router } from "express";
import {
  loginRestaurantController,
  getAuthTokenFromRefreshToken,
  logoutRestaurantController,
  validatePasswordTokenController,
  createPasswordController,
  forgotPasswordController,
  resetOwnerPassword,
} from "../controllers/Auth.controller";
import { createValidator, ExpressJoiInstance } from "express-joi-validation";
import {
  loginRestaurantValidator,
  refreshTokenRequestValidator,
  protectedRoutesValidator,
  validatePasswordQueryValidator,
  validatePasswordHeaderValidator,
  createRestaurantPasswordValidator,
  forgotPasswordValidator,
  resetOwnerPasswordValidator,
} from "../validators/Auth.validator";
import { assignJWT, authenticateJWT } from "../middlewares/auth.middlewares";

const validator: ExpressJoiInstance = createValidator({});

export const authRouter: Router = express.Router();

authRouter
  .route("/resetPassword/owner")
  .post(validator.body(resetOwnerPasswordValidator), resetOwnerPassword);

authRouter
  .route("/forgotPassword")
  .post(validator.body(forgotPasswordValidator), forgotPasswordController);

authRouter
  .route("/createPassword")
  .post(
    validator.body(createRestaurantPasswordValidator),
    createPasswordController
  );

authRouter
  .route("/validatePasswordToken")
  .get(
    validator.query(validatePasswordQueryValidator),
    validator.headers(validatePasswordHeaderValidator),
    validatePasswordTokenController
  );

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
