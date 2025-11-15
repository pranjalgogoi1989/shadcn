import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // each user has one wallet
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    transactions: [
      {
        type: {
          type: String,
          enum: [
            "Credit", // money added to wallet
            "Debit",  // money used for purchase
          ],
          required: true,
        },
        source: {
          type: String,
          enum: ["Order Refund","Admin Credit","Wallet Top-up","Purchase","Withdrawal", "Adjustment",],
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
        },
        refundId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Refund",
        },
        transactionId: {
          type: String, // external payment reference if applicable
        },
        status: {
          type: String,
          enum: ["Pending", "Completed", "Failed"],
          default: "Completed",
        },
        remarks: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Wallet ||
  mongoose.model("Wallet", WalletSchema);