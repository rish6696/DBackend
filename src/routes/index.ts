import express, { Router } from "express";
import { authRouter } from "./Auth.Router";
import { restaurantRoute } from "./Restaurant.Router";

export const router: Router = express.Router();

router.use("/auth", authRouter);
router.use("/restaurant", restaurantRoute);
