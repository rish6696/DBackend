import { restaurantSchema } from "./restaurant.model";
import Mongoose from "mongoose";
import { RestaurantInterface } from "../interface/RestrauManagement.interface";

export function restaurantModel(): Mongoose.Model<RestaurantInterface> {
  return Mongoose.model<RestaurantInterface>("restaurant", restaurantSchema);
}
