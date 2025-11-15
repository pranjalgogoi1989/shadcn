import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

export async function GET() {
    try {
        await dbConnect();
        //const products = await Product.find({}).sort({"variants.discount": -1}).limit(12);
        const variants = await Product.aggregate([
            { $unwind: "$variants" },
            { $sort: { "variants.discount": -1 } },
            { $limit: 12 },
            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    productTitle: "$title",  // or "$name" if your field is named "name"
                    "variantId": "$variants._id",
                    "variantAttributes": "$variants.attributes",
                    "variantPrice": "$variants.price",
                    "variantOriginalPrice": "$variants.originalPrice",
                    "variantDiscount": "$variants.discount",
                    "variantImage": "$variants.images", // optional
                    finalPrice: {
                        $subtract: [
                        "$variants.price",
                        { $multiply: ["$variants.price", { $divide: ["$variants.discount", 100] }] },
                        ],
                    },
                },
            },
            ]);
        return NextResponse.json({products: variants, status: 200 });
    } catch (error) {
        console.error("❌ Error fetching best deals:", error);
        return NextResponse.json({ error: "Failed to fetch best deals" }, { status: 500 });
    }
}