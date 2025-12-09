import dbConnect from "@/lib/dbConnect";
import DeliveryPartner from "@/models/DeliveryPartner";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try {
        await dbConnect();
        const data = await DeliveryPartner.find({});
        return NextResponse.json({ data: data, status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req:NextRequest){
    try {
        const body = await req.json();
        console.log(body);
        await dbConnect();
        const result = await DeliveryPartner.insertOne({...body});
        return NextResponse.json({message:'Delivery Partner added successfully', status: 200 });
    } catch (error) {
        console.error("❌ Error saving delivery partner details:", error);
        return NextResponse.json({ error: "Failed to save delivery partner details" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest){
    try {
        const body = await req.json();
        const { _id, ...updateFields } = body;
        if (!_id) {
            return NextResponse.json(
                { error: "ID is required" },
                { status: 400 }
            );
        }
        await dbConnect();
        const result = await DeliveryPartner.updateOne({ _id },{ $set: updateFields });
        console.log(result);
        return NextResponse.json({message:'Delivery Partner updated successfully', status: 200 });
    } catch (error) {
        console.error("❌ Error saving delivery partner details:", error);
        return NextResponse.json({ error: "Failed to save delivery partner details" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest){
    const body = await req.json();
    const {key_id} = body;
    if(!key_id) return NextResponse.json({ message: "Delivery Partner not found" ,status: 404 });
    try {
        dbConnect();
        const result = await DeliveryPartner.deleteOne({_id: key_id});
        return NextResponse.json({message:'Delivery Partner deleted successfully', status: 200 });
    } catch (error) {
        console.error("❌ Error fetching delivery partner:", error);
        return NextResponse.json({ error: "Failed to fetch delivery partner" }, { status: 500 });
    }
}