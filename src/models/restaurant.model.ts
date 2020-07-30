import { AdminSchema } from "./admin.model";
import mongoose, { Mongoose } from "mongoose";
import { boolean } from "@hapi/joi";

export const restaurantSchema = new mongoose.Schema({
  restaurantId: { type: String, required: true },
  brandName: { type: String, required: true },
  restaurantName: { type: String, required: true },
  restaurantType: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: false },
  phone: { type: String, required: true },
  ownerName: { type: String, required: true },
  addresses: [
    {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      pin: { type: String, required: true },
    },
  ],
  filters: [],
  qRCode: { type: String, required: false },
  admins: [AdminSchema],
  createdAt: { type: Date, default: Date.now() },
  themeColor: { type: String, required: true },
  restaurantLogo: { type: String, required: true },
  brandLogo: { type: String, required: true },
  backgroundVideo: { type: String, required: true },
  createPasswordCredentials: new mongoose.Schema({
    isValid: { type: Boolean, default: true },
    code: { type: String, required: true },
    expiredOn: { type: Date, required: false },
  }),
});
