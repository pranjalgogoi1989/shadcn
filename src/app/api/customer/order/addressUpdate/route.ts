import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function POST(req : NextRequest) {
    const body = await req.json();
    const{id,address} = body;
    try {
        await dbConnect();
        if(!id) return NextResponse.json({ success: false, message: "Order ID required" }, { status: 400 });
        const resp = await Order.findOneAndUpdate({ _id: id }, {$set: { shippingAddress: address }});
        if(!resp) return NextResponse.json({ success: false,message: "Order not found" }, { status: 404 });
        return NextResponse.json({ success: true, message: "Address updated successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}