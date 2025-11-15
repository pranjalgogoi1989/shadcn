import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import CategoryVariant from "@/models/CategoryVariant";
import Review from "@/models/Review";
import ProductReview from "@/models/ProductReview";
import Order from "@/models/Order";
import mongoose from "mongoose";

export async function GET(req: Request, { params }: { params: { product_id: string } }) {
    const { product_id } = await params;
    
  await dbConnect();

  const product = await Product.findOne({ _id: product_id });
  if (!product)
    return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });

  const categoryVariant = await CategoryVariant.findOne({ categoryId: product.categoryId });
  const variants= categoryVariant.variantFields.map((v: any) => v.name);


  const reviews = await ProductReview.find({ productId: new mongoose.Types.ObjectId(product_id) }).populate("userId", "image name").lean();
  const avgRating = reviews.length ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : 0;


  const totalOrders = await Order.countDocuments({ "items.productId": new mongoose.Types.ObjectId(product_id), "items.status": { $ne: "Pending" } });
  return NextResponse.json({
    success: true,
    product:product,
    categoryVariant: variants,
    reviews:reviews,
    avgRating:avgRating,
    totalOrders:totalOrders
  });
}