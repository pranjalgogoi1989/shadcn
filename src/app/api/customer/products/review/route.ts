import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import ProductReview from "@/models/ProductReview";

export async function GET(req: NextRequest){
    const  productId  = req.nextUrl.searchParams.get("productId");
    try{
        await dbConnect();
        const orderreview = await ProductReview.find({productId:productId}).populate("userId", "image name").lean();
        return NextResponse.json({ success:true, orderreview: orderreview, status: 200 });
    }catch(err){
        return NextResponse.json({ success:false,status: 500, message: err.message });
    }
}

export async function POST(req:NextRequest){
    const body = await req.json();
    const {productId, userId, rating, comment} = body;
    if(!productId) return NextResponse.json({success:false, message:"Please select the product first", status:400});
    try {     
        await dbConnect();
        const result= await ProductReview.findOneAndUpdate({productId:productId},{$set: {userId:userId, rating:rating, comment:comment}},{upsert:true, new:true});
        return NextResponse.json({success:false, message:"Order Feedback Submitted Successfully", status:200});
    } catch (error) {
        return NextResponse.json({success:false, message:"Something went wrong"+error, status:400});
    }
}