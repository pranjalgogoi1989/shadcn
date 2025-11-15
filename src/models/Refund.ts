
import mongoose from 'mongoose';

const RefundSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    itemId: { type: String, required: true},
    sellerId: { type: String, required: true},
    amount: { type: Number, required:true},
    refundId: { type: String, },
    refundAmount: { type: Number, },
    refundMethod: {
      type: String,
      enum: ["Original Payment Method", "Wallet", "Manual Bank Transfer"],
      default: "Original Payment Method",
    },
    refundStatus: { type: String, required:true, default:"Pending"},
  },
  { timestamps: true,}
);

export default mongoose.models.Refund || mongoose.model('Refund', RefundSchema);

