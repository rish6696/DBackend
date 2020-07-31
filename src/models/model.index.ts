import { restaurantSchema } from "./restaurant.model";
import Mongoose from "mongoose";
import { RestaurantInterface } from "../interface/Restaurant.Interface";

export function restaurantModel(): Mongoose.Model<RestaurantInterface> {
  return Mongoose.model<RestaurantInterface>("restaurant", restaurantSchema);
}
