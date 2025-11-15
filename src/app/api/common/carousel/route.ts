import { NextRequest, NextResponse } from "next/server";
import Carousel  from "@/models/Carousel";
import  dbConnect  from "@/lib/dbConnect";

export async function GET() {
    try {
        await dbConnect();
        const carousel = await Carousel.find({}).sort({priority: 1});
        return NextResponse.json(carousel, { status: 200 });
    } catch (error) {
        console.error("❌ Error fetching carousel items:", error);
        return NextResponse.json({ error: "Failed to fetch carousel item" }, { status: 500 });
    }
}  
