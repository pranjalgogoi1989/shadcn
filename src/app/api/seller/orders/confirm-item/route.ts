
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(req: NextRequest){
    const body = await req.json();
    const { orderId, itemId, status } = body;
    await dbConnect();
    const order = await Order.findById(orderId);
    if(!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    const result = await Order.updateOne(
      {
        _id: orderId,
        "items.variantId": itemId,
      },
      {
        $set: {
          "items.$[i].status": status,
        },
      },
      {
        arrayFilters: [
          { "i.variantId": itemId },
        ],
      }
    );


    return NextResponse.json({message:'Order-Item confirmed successfully', status: 200 });
}