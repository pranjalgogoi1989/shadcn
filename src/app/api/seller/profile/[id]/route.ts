
import Seller from "@/models/Seller";
import { NextRequest,NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
//import { getServerSession } from "next-auth/next";

export async function GET(req, { params }) {
    const { id } = await params;
    await dbConnect();
    const seller = await Seller.findOne({ userId: new mongoose.Types.ObjectId(id)});
    if (!seller) return NextResponse.json({ error: "Not found" }, { status: 404 });
    console.log(seller);
    return NextResponse.json({ success: true, seller:seller, userId: id });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        await dbConnect();
        //console.log(body);
        const seller = await Seller.create(body);
        return NextResponse.json({message:'Profile updated successfully', status: 200 });
    } catch (error) {
        console.error("❌ Error saving seller details:", error);
        return NextResponse.json({ error: "Failed to save seller details" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, ...updateFields } = body;
        if (!userId) {
            return NextResponse.json(
                { error: "userId is required" },
                { status: 400 }
            );
        }
        await dbConnect();
        const result = await Seller.updateOne({ userId },{ $set: updateFields });
        console.log(result);
        return NextResponse.json({message:'Profile updated successfully', status: 200 });
    } catch (error) {
        console.error("❌ Error saving seller details:", error);
        return NextResponse.json({ error: "Failed to save seller details" }, { status: 500 });
    }
}