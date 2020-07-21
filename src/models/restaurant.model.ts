import { AdminSchema } from "./subAdmin.model";
import mongoose from "mongoose";

export const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emails: [{ type: String, required: true }],
  phones: [{ type: String, required: true }],
  filter: [],
  qRCode: { type: String, required: true },
  admins: [AdminSchema],
  restaurantId: { type: String, required: true },
});
