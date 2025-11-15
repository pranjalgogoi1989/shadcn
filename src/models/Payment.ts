import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Common fields
  gateway: { type: String, required: true }, // e.g. "razorpay", "stripe", "paypal"
  amount: { type: Number, required: true, default: 0 },
  currency: { type: String, default: "INR" },

  // Gateway-specific details
  transactionId: { type: String },   // Payment ID from gateway
  gatewayOrderId: { type: String },  // Order ID from gateway (if applicable)
  signature: { type: String },       // Signature or checksum
  receiptId: { type: String },       // Your internal receipt reference

  // Optional details
  method: { type: String },          // "card", "upi", "netbanking", etc.
  email: { type: String },
  contact: { type: String },

  status: {
    type: String,
    enum: ["created", "authorized", "captured", "failed", "refunded"],
    default: "created"
  },
  refundId: { type: String },
  refundStatus: { type: String },
  refundAmount: { type: Number },
  meta: { type: Object }, // For any extra data you want to store

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

PaymentSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);