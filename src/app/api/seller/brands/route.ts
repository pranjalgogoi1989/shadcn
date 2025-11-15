
import dbConnect from '@/lib/dbConnect';
import Brands from '@/models/Brands';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest){
    const limit_page_default = Number(process.env.NEXT_PUBLIC_DISPLAY_PER_PAGE);
    
    try {
        const url = new URL(req.url);
        const page = Number(url.searchParams.get("page")) || 1;
        const limit = Number(limit_page_default);
        await dbConnect();
        const brands = await Brands.find({}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
        if(!brands) return NextResponse.json({status:400, message: "No brand information found on server"})
        const pageCount = await Brands.countDocuments();
        console.log(Math.ceil(pageCount/limit));
        return NextResponse.json({success:true, brands: brands, totalPages: Math.ceil(pageCount / limit), status: 200 });
    } catch (error) {
        
    }
    
}

export async function POST(req: NextRequest){
     const body = await req.json();
    const {name, description, dealsWith} = body;
    await dbConnect();
    const updatedData = await Brands.insertOne({name, description, dealsWith});
    return NextResponse.json({status:200, message:"Brabd data updated successfully"});
}

export async function DELETE(req: NextRequest){
    const body = await req.json();
    const {key_id} = body;
    if(!key_id) return NextResponse.json({ message: "Brand Id not found" ,status: 404 });
    try {
        dbConnect();
        const result = await Brands.deleteOne({_id: key_id});
        return NextResponse.json({message:'Brand deleted successfully', status: 200 });
    } catch (error) {
        console.error("❌ Error fetching brand details:", error);
        return NextResponse.json({ error: "Failed to fetch brand details" , status: 500 });
    }
}