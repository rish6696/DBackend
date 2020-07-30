import Mongoose from "mongoose";
import { ValidatedRequestSchema, ContainerTypes } from "express-joi-validation";
import * as joi from "@hapi/joi";
import "joi-extract-type";
import { createRestaurantValidator } from "../validators/Restaurant.validator";

export interface RestaurantInterface extends Mongoose.Document {
  restaurantId: string;
  brandName: string;
  restaurantName: string;
  restaurantType: string;
  email: string;
  phone: string;
  password: string;
  ownerName: string;
  addresses: {
    address: string;
    city: string;
    state: string;
    country: string;
    pin: string;
  }[];
  filters: [];
  qRCode: string;
  admins: {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    permissions: string[];
    isOwner: boolean;
  }[];
  createdAt: Date;
  themeColor: string;
  restaurantLogo: string;
  brandLogo: string;
  backgroundVideo: string;
  createPasswordCredentials: {
    isValid: boolean;
    code: string;
    expiredOn: Date;
  };
}

export interface AdminInterface extends Mongoose.Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  permissions: string[];
  isOwner: boolean;
}
