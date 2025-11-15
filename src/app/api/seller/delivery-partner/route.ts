import dbConnect from "@/lib/dbConnect";
import DeliveryPartner from "@/models/DeliveryPartner";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try {
        await dbConnect();
        const data = await DeliveryPartner.find({});
        return NextResponse.json({ data: data, status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}