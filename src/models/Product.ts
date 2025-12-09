// models/Product.ts
import mongoose from "mongoose";
// import Category from "./Category";


const VariantSchema = new mongoose.Schema({
  attributes: {type: Map, of: String,}, // e.g. { Color: "Red", Size: "M", Fabric: "Cotton" }
  images: [{ type: String }], // each variant can have its own image gallery
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  deliveryCharge: { type: Number, default: 0 },
  orderCount: { type: Number, default: 0 },

  originalPrice: { type: Number, default: 0 }, //last added
  discount: { type: Number, default: 0 }, //last added
});

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    basePrice: { type: Number, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    brand: { type: String },
    mainImage: [{ type: String }],
    variants: [VariantSchema], // dynamic abstract variants
    sellerId:{type:mongoose.Schema.Types.ObjectId, ref:"Seller"},
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);