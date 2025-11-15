import { NextRequest, NextResponse } from "next/server";
import Category from "@/models/Category";
import  dbConnect  from "@/lib/dbConnect";

export async function GET(req:NextRequest){
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug") || "";
    try{
        await dbConnect();
        const data = await Category.findOne({slug:slug}).select("_id");
        return NextResponse.json({ success:true, data: data, status: 200 });

    }catch(err:any){
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}