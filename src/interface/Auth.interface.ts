import Mongoose from "mongoose";

export interface LoginRestaurantInterface extends Mongoose.Document {
  username: string;
  password: string;
  userId: string;
}
