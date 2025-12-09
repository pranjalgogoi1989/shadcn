import mongoose from "mongoose";
import OrderTracking from "./OrderTracking";
//import { de } from "date-fns/locale";

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  variantId: String,
  title: String,
  image: String,
  variant: {
    type: Map,
    of: String, // dynamic attributes (Color: "Red", Size: "L", etc.)
    default: {},
  },
  price: Number,
  deliveryCharge: Number,
  quantity: Number,
  subtotal: Number,
  status: {type: String, default: "pending",},
  sellerId:{type:String },
  trackingVia: {type: mongoose.Schema.Types.ObjectId, ref: OrderTracking},
});

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: [OrderItemSchema],
    shippingAddress: {
      cust_name: {type: String, default: ""},
      phone: {type: String, default: ""},
      address_line_1: {type: String, default: ""},
      address_line_2:{type: String, default: ""},
      city: {type: String, default: ""},
      state: {type: String, default: ""},
      pincode: {type: String, default: ""},
    },
    totalAmount: { type: Number, required: true },
    paymentMethod: {type: String,enum: ["COD", "ONLINE"],default: "COD", },
    paymentStatus: { type: String, default: "Pending" },
    status: { type: String, default: "Pending", },
    remarks: {type: String, default: ""},
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);