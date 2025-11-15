import dbConnect from "@/lib/dbConnect";
import Refund from "@/models/Refund";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import User from "@/models/User";
import Order from "@/models/Order";
import Wallet from "@/models/Wallet";
import { Currency } from "lucide-react";
import Return from "@/models/Return";

const limit_page_default = Number(process.env.NEXT_PUBLIC_DISPLAY_PER_PAGE);

export async function GET(req:NextRequest){
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(limit_page_default);

    const session = await getServerSession();
    if(!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const email = session?.user?.email;
    try {
        await dbConnect();
        const user = await User.findOne({email: email});
        if(!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const data = await Refund.find({sellerId: user._id})
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();
        //return NextResponse.json({success:true, refunds: data, status: 200 });
        const recordCount = data.length; 
        return NextResponse.json({ success: true, refunds: data, totalPages: Math.ceil(recordCount / limit), status:200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(req:NextRequest){
    const body = await req.json();

    const {refundId, orderId, itemId, refundMethod, refundAmount} =body;

    try {
        await dbConnect();
        const order = await Order.findOne({_id:orderId});
        if(order){
            const org_paymentMethod = order.paymentMethod;
            if(org_paymentMethod === "COD" || refundMethod === "Wallet"){
                //return to wallet for later withdrawal
                await Refund.findOneAndUpdate({_id:refundId},{$set:{ refundAmount: refundAmount, refundMethod:"Wallet", refundStatus:"Completed"}},{upsert:true});
                await Wallet.findOneAndUpdate({userId: order.userId},{
                    $set:{currency:'INR'},
                    $inc: { balance: + refundAmount },
                    $push: {
                        transactions: {
                            type: "Credit",
                            source: "Order Refund",
                            amount: refundAmount,
                            orderId: orderId,
                            refundId: refundId,
                            transactionId: '',
                            status: 'Completed',
                            remarks: "Order placed using wallet funds",
                        },
                    },
                },{upsert:true, new:true});
            }else{
                await Refund.findOneAndUpdate({_id:refundId},{$set:{ refundMethod:refundMethod, refundStatus:"Completed"}},{upsert:true});
            }
            await Return.findOneAndUpdate({orderId:orderId, itemId: itemId},{$set:{status:"Refunded"}},{upsert:true});
            //put any additional logic here. I just can't think of it right now.
            return NextResponse.json({success:true,message:"Refund Completed Successfully", status:200});

        }
        return NextResponse.json({success:true, status:200});
    } catch (error) {
        return NextResponse.json({success:false, message:"Error in processing your request "+error, status:200});
    }

}