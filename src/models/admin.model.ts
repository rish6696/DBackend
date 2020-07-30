import mongoose, { Schema } from "mongoose";

export const AdminSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, required: true, default: new Date() },
  permissions: [],
  isOwner: { type: Boolean, required: true },
});
