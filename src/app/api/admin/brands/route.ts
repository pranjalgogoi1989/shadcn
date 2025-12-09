
import dbConnect from '@/lib/dbConnect';
import Brands from '@/models/Brands';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(){
    await dbConnect();
    const brands = await Brands.find({}).sort({name:-1});
    if(!brands) return NextResponse.json({status:400, message: "No brand information found on server"})
    return NextResponse.json({status:200, brands:brands});
}

export async function POST(req: NextRequest){
     const body = await req.json();
    const {name, description, dealsWith} = body;
    await dbConnect();
    await Brands.insertOne({name, description, dealsWith});
    return NextResponse.json({status:200, message:"Brabd data updated successfully"});
}

export async function DELETE(req: NextRequest){
    const body = await req.json();
    const {key_id} = body;
    if(!key_id) return NextResponse.json({ message: "Brand Id not found" ,status: 404 });
    try {
        dbConnect();
        await Brands.deleteOne({_id: key_id});
        return NextResponse.json({message:'Brand deleted successfully', status: 200 });
    } catch (error) {
        console.error("❌ Error fetching brand details:", error);
        return NextResponse.json({ error: "Failed to fetch brand details" , status: 500 });
    }
}