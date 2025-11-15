import mongoose, { ObjectId, Schema, Document } from "mongoose";

export interface ISeller extends Document{
  userId: ObjectId,
  name: string,
  shopName: string,
  address: string,
  phone: string,
  email: string,
  bankDetails: {
    accountName: string,
    accountNumber: string,
    bankName: string,
    bankAddress: string,
    ifsc: string,
    branch: string
  },
  gst: string,
}
export interface IBankDetails extends Document{
  accountName: string,
  accountNumber: string,
  bankName: string,
  bankAddress: string,
  ifsc: string,
  branch: string
}
const SellerSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true }, // link to user account
  name: {type: String, required: true},
  address: {type: String, required: true},
  phone: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  description: {type: String, required: false},
  bankDetails: {
    accountName: {type: String, required: false},
    accountNumber: {type: String, required: false},
    bankName: {type: String, required: false},
    bankAddress: {type: String, required: false},
    ifsc: {type: String, required: false},
    branch: {type: String, required: false}
  },
  gst: {type: String, required: true, unique: true},
}, { timestamps: true });

export default mongoose.models.Seller || mongoose.model("Seller", SellerSchema);