import mongoose, { Schema, Document } from "mongoose";

export interface IUserAddress extends Document {
    user_id: mongoose.Types.ObjectId;
    address_type: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    is_default: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserAddressSchema = new Schema<IUserAddress>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    address_type: { type: String, required: true },
    address_line_1: { type: String, required: true },
    address_line_2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
    is_default: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export default mongoose.models.UserAddress ||
  mongoose.model<IUserAddress>("UserAddress", UserAddressSchema);