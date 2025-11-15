import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  variantId: String,
  title: String,
  image: String,
  variant: {type: Map, of: String, default: {},}, // dynamic attributes like Color: "Red", Size: "L"
  price: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  quantity: { type: Number, default: 1 },
  subtotal: { type: Number, default: 0 },
  sellerId:{ type:mongoose.Schema.Types.ObjectId, ref:"Seller"}
});

const CartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);