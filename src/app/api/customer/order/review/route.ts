import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import OrderReview from "@/models/OrderReview";

export async function GET(req: NextRequest){
    const  orderId  = req.nextUrl.searchParams.get("orderId");
    try{
        await dbConnect();
        const orderreview = await OrderReview.find({orderId:orderId});
        return NextResponse.json({ success:true, orderreview: orderreview, status: 200 });
    }catch(err){
        return NextResponse.json({ success:false,status: 500, message: err.message });
    }
}

export async function POST(req:NextRequest){
    const body = await req.json();
    const {orderId, productId, userId, rating, comment} = body;
    if(!productId || !orderId) return NextResponse.json({success:false, message:"Please select the product first", status:400});
    try {     
        await dbConnect();
        const result= await OrderReview.findOneAndUpdate({orderId: orderId, productId:productId},{$set: {userId:userId, rating:rating, comment:comment}},{upsert:true, new:true});
        return NextResponse.json({success:false, message:"Order Feedback Submitted Successfully", status:200});
    } catch (error) {
        return NextResponse.json({success:false, message:"Something went wrong"+error, status:400});
    }
}