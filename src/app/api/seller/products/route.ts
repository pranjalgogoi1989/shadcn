import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";

import Category from "@/models/Category";

export async function GET(req: NextRequest) {
  const limit_page_default = Number(process.env.NEXT_PUBLIC_DISPLAY_PER_PAGE);
  try {
      await dbConnect();
      const url = new URL(req.url);
      
      const category = url.searchParams.get("categoryId");
      const page = Number(url.searchParams.get("page")) || 1;
      const limit = Number(limit_page_default);
      const filter = category ? { categoryId: category } : {};

      const productCount = await Product.countDocuments();
      const products = await Product.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
      const flattened = products.map(p => ({
        ...p,
        categoryName: p.categoryId?.cat_name || null
      }));
      //console.log(flattened);
      return NextResponse.json({success:true, products: products, totalPages: Math.ceil(productCount / limit), status: 200 });
  } catch (error) {
      console.error("❌ Error fetching products:", error);
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if(!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const userId = session?.user?.id;
    const categoryId = body.categoryId;
    const title = body.title;
    const description = body.description;
    const basePrice = body.basePrice;
    const brand = body.brand;
    const mainImage = body.mainImage;
    const variants = body.variants;
    const baseProduct: any = {
      title,
      description,
      categoryId,
      basePrice,
      brand,
      variants: [],
      mainImage,
      sellerId: userId,
    };

    await dbConnect();
    if (variants && Array.isArray(variants)) {
      baseProduct.variants = variants.map((variant: any) => {
        const variantObj: any = {
          attributes: variant.attributes,
          images: variant.images || [],
          stock: parseInt(variant.stock || 0),
          price: parseFloat(variant.price || 0),
          deliveryCharge: parseFloat(variant.deliveryCharge || 0),
          originalPrice: parseFloat(variant.originalPrice || 0),
          discount: parseFloat(variant.discount || 0),
        };
        return variantObj;
      });
    }
    const newProduct = new Product(baseProduct);
    await newProduct.save();

    return NextResponse.json({ success: true, product: newProduct, message: "Product saved successfully!" ,status: 200 });
  } catch (error: any) {
    console.error("Product Save Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server Error" },
      { status: 500 }
    );
  }
}