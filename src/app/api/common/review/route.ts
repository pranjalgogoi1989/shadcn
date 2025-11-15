import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OrderReview from "@/models/OrderReview";

export async function GET(req:NextRequest, {params}:{params:{id:string}}){
    const { searchParams } = new URL(req.url);
    const productId = Number(searchParams.get("id"));

    if(!productId) return NextResponse.json({success:false, message:"Please select the product first", status:400});
    await dbConnect();
    const reviews = await OrderReview.find({productId:productId}).lean();
    const avgRating = reviews.length ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : 0;
    return NextResponse.json({success:false, reviews:reviews, avgRating:avgRating, status:200});
}

export async function POST(req:NextRequest){
    const body = await req.json();
    const {productId, userId, rating, comment} = body;
    if(!productId) return NextResponse.json({success:false, message:"Please select the product first", status:400});
    try {     
        await dbConnect();
        const result= await OrderReview.findOneAndUpdate({productId:productId},{$set: {userId:userId, rating:rating, comment:comment}},{upsert:true, new:true});
        return NextResponse.json({success:false, message:"Feedback Submitted Successfully", status:200});
    } catch (error) {
        return NextResponse.json({success:false, message:"Something went wrong"+error, status:400});
    }
}