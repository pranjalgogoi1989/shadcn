import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import CategoryVariant from "@/models/CategoryVariant";
import Review from "@/models/Review";

export async function GET(req: Request, { params }: { params: { product_id: string } }) {
    const { product_id } = await params;
    
  await dbConnect();

  const product = await Product.findOne({ _id: product_id });
  if (!product)
    return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });

  const categoryVariant = await CategoryVariant.findOne({ categoryId: product.categoryId });
  const variants= categoryVariant.variantFields.map((v: any) => v.name);


  const reviews = await Review.find({ productId: params.id }).lean();
  const avgRating = reviews.length ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : 0;

  const totalOrders = product.variants.reduce((sum, v) => sum + (v.orderCount || 0), 0);

  return NextResponse.json({
    success: true,
    product:product,
    categoryVariant: variants,
    reviews:reviews,
    avgRating:avgRating,
    totalOrders:totalOrders
  });
}