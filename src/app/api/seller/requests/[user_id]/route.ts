
import dbConnect from "@/lib/dbConnect";
import SellerRequest from "@/models/SellerRequest";
import { NextResponse } from "next/server";


export async function GET(req, { params }) {
    const { user_id } = await params;
    dbConnect();
    const result = await SellerRequest.findOne({ user_id: user_id });
    return NextResponse.json({status: 200, message: "Success", data: result});
}