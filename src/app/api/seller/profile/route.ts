
import Seller from "@/models/Seller";
import { NextRequest,NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
    await dbConnect();
    const seller = await Seller.find({});
    return NextResponse.json({ data:seller, status: 200 });

}


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        await dbConnect();
        const seller = await Seller.create(body);
        return NextResponse.json(seller);
    } catch (error) {
        console.error("❌ Error saving product categories:", error);
        return NextResponse.json({ error: "Failed to save product categories" }, { status: 500 });
    }
}