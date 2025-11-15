import dbConnect from "@/lib/dbConnect";
import {NextResponse } from "next/server";
import Brand from "@/models/Brands";

export async function GET(){
    try{
        await dbConnect();
        const brands = await Brand.find({});
        if(!brands) return NextResponse.json({ status: 400, message: "No brand information found on server" })
        return NextResponse.json({ status: 200, message: "Success",brands });
    }catch(err){
        return NextResponse.json({ status: 500, message: err.message });
    }
}