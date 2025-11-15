import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
  await dbConnect();
  const limit_page_default = Number(process.env.NEXT_PUBLIC_DISPLAY_PER_PAGE);
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit")) || limit_page_default;
  const page = Number(searchParams.get("page")) || 1;
  
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const minPrice = Number(searchParams.get("minPrice"));
  const maxPrice = Number(searchParams.get("maxPrice"));
  const brand = searchParams.get("brand") || "";
  const sSort = searchParams.get("sort") || "price-asc";
  
  let sortCondition: Record<string, 1 | -1> = { createdAt: -1 }; // default

  if (sSort === "price-asc") sortCondition = { price: 1 };
  if (sSort === "price-desc") sortCondition = { price: -1 };
  if (sSort === "name-asc") sortCondition = { title: 1 };
  if (sSort === "name-desc") sortCondition = { title: -1 };

  if (!query.trim()) {
    return NextResponse.json({ products: [] });
  }

  const regex = new RegExp(query, "i");
  const match: any = {
    $or: [
      { title: regex },
      { brand: regex },
      { categoryId: regex },
      { description: regex },
      { tags: { $regex: regex } },
    ],
  };
  if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice !== 0 && maxPrice !== 0) {
    match.basePrice = { $gte: minPrice, $lte: maxPrice };
  }
  if (brand!=="") {
    match.brand = brand;
  }
  if (category!=="") {
    match.categoryId = category;
  }
  
  const result = await Product.aggregate([
    {$match: match},
    {
      $facet: {
        products: [

          { $sort: sortCondition },
          { $skip: (page - 1) * limit },
          { $limit: limit },
        ],
        priceRange: [
          {
            $group: {
              _id: null,
              minPrice: { $min: "$basePrice" },
              maxPrice: { $max: "$basePrice" },
            },
          },
        ],
      },
    },
  ]);

  const products = result[0]?.products || [];
  const priceRange = result[0]?.priceRange?.[0] || { minPrice: 0, maxPrice: 0 };
  return NextResponse.json({ success: true, products, priceRange: priceRange, });
}