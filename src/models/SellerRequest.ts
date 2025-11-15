import mongoose from "mongoose";

const SellerRequestSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId,ref: "User",required: true,},
  business_name: {type: String,required: true,},
  business_email: {type: String,required: true,},
  business_phone: {type: String,required: true,},
  business_address: {type: String,required: true,},
  description: {type: String,},
  gst: {type: String,required: true,},
  status: {type: String,enum: ["pending", "approved", "rejected"],default: "pending",},
  createdAt: {type: Date,default: Date.now,},
});

export default mongoose.models.SellerRequest || mongoose.model("SellerRequest", SellerRequestSchema);