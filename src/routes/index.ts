import express, { Router } from "express";
import { authRestaurantRouter } from "./Auth.Restaurant.Router";
import { restaurantRoute } from "./Restaurant.Router";

export const router: Router = express.Router();

router.use("/auth/restaurant", authRestaurantRouter);
router.use("/restaurant", restaurantRoute);
