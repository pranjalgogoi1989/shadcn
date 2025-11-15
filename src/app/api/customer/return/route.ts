import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Return from "@/models/Return";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    const { searchParams } = new URL(req.url); // ✅ works in any environment
    const orderId = searchParams.get("orderId");
    try {
        await dbConnect();
        const data = await Return.find({});
        return NextResponse.json({ success:true, data: data, status: 200 });
    } catch (err: any) {
        return NextResponse.json({success:false, error: err.message }, { status: 500 });
    }
}

export async function POST(req:NextRequest){
    const body = await req.json();
    const {orderId, itemId, cancelReason} = body;
    if(!orderId || !itemId){
        return NextResponse.json({success:false, message:'Please check your inputs carefully', status:200})
    }
    try {
        await dbConnect();
        const result = await Return.findOneAndUpdate({orderId, itemId}, { $set: {reason:cancelReason, status:'Pending'}},{upsert:true, new:true});
        const result2 = await Order.findOneAndUpdate({_id: orderId, "items._id": itemId},{$set:{"items.$.status":"Return"}},{upsert:true});
        if(result){
            return NextResponse.json({success:true, message:"Return Requested Successfully", status:200})
        }
    } catch (error) {
        return NextResponse.json({success:false, message:"Error in requesting your return"+error, status:200})
    }
    return NextResponse.json({success:true, message:"",status:200});
}