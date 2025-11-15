import { NextResponse } from "next/server";
import  dbConnect  from "@/lib/dbConnect";
import Product from "@/models/Product";
import CategoryVariant from "@/models/CategoryVariant";
import mongoose from "mongoose";
import Order from "@/models/Order";
import ProductReview from "@/models/ProductReview";

export async function GET(req: Request, { params }) {
  const { id } = await params;
  console.log(id);
  await dbConnect();

  const product = await Product.findOne({ _id: id });
  if (!product)
    return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });

  const categoryVariant = await CategoryVariant.findOne({ categoryId: product.categoryId });
  const variants= categoryVariant.variantFields.map((v: any) => v.name);


  const reviews = await ProductReview.find({ productId: id }).populate("userId", "image name").lean();
  const avgRating = reviews.length ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : 0;

  //const totalOrders = product.variants.reduce((sum, v) => sum + (v.orderCount || 0), 0);
  const totalOrders = await Order.countDocuments({ "items.productId": new mongoose.Types.ObjectId(id), "items.status": { $ne: "Pending" } });

  return NextResponse.json({
    success: true,
    product:product,
    categoryVariant: variants,
    reviews:reviews,
    avgRating:avgRating,
    totalOrders:totalOrders
  });
}
