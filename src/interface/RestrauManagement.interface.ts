import Mongoose from "mongoose";

export interface RestaurantInterface extends Mongoose.Document {
  _id: string;
  name: string;
  emails: string[];
  phones: string[];
  filter: string[];
  qRCode: string;
  restaurantId: string;
  admins: {
    _id: string;
    name: string;
    username: string;
    password: string;
    createdAt: Date;
    permissions: string[];
  }[];
}

export interface AdminInterface extends Mongoose.Document {
  name: string;
  username: string;
  password: string;
  createdAt: Date;
  permissions: string[];
  roleId: number;
}
