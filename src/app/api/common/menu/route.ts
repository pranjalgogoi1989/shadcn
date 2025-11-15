import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest){
    try{
        await dbConnect();
        const data = await Category.find({}).sort({createdAt:-1});
        return NextResponse.json({ data: data, status: 200 });
    }catch(err:any){
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}