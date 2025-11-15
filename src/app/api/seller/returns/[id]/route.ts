import dbConnect from "@/lib/dbConnect";
import Refund from "@/models/Refund";
import Return from "@/models/Return";
import { NextRequest, NextResponse } from "next/server";
import {getServerSession} from "next-auth/next";
import User from "@/models/User";

export async function GET(req:NextRequest, {params}:{params:{id:string}}){
    const {id} = await params;
    try {
        await dbConnect();
        const data = await Return.find({orderId:id});
        return NextResponse.json({ success:true, data: data, status: 200 });
    } catch (err: any) {
        return NextResponse.json({success:false, error: err.message }, { status: 500 });
    }
}

export async function PUT(req:NextRequest, {params}:{params:{id:string}}){
    const session = await getServerSession();
    const {id} = await params;
    const body = await req.json();
    const returnId = body.returnId;
    const status = body.status;

    const orderId = body?.orderId;
    const itemId = body?.itemId;
    const amount = body?.amount || 0;
    try {
        await dbConnect();
        const data = await Return.findOneAndUpdate({_id:returnId},{$set:{status:status}});
        if(amount!==0){
            const user = await User.findOne({email: session?.user?.email});
            await Refund.findOneAndUpdate({orderId: orderId, itemId: itemId},{$set:{sellerId: user?._id, amount: amount, refundStatus: status}},{upsert:true, new:true});
        }
        return NextResponse.json({ success:true, message: "Return status updated", status: 200 });
    } catch (err: any) {
        return NextResponse.json({success:false, error: err.message }, { status: 500 });
    }
}

// export async function POST(req:NextRequest){
//     const body = await req.json();
//     const {orderId, itemId, cancelReason} = body;
//     if(!orderId || !itemId){
//         return NextResponse.json({success:false, message:'Please check your inputs carefully', status:200})
//     }
//     try {
//         await dbConnect();
//         const result = await Return.findOneAndUpdate({orderId, itemId}, { $set: {reason:cancelReason, status:'Pending'}},{upsert:true, new:true});
//         const result2 = await Order.findOneAndUpdate({_id: orderId, "items._id": itemId},{$set:{"items.$.status":"Return"}},{upsert:true});
//         if(result){
//             return NextResponse.json({success:true, message:"Return Requested Successfully", status:200})
//         }
//     } catch (error) {
//         return NextResponse.json({success:false, message:"Error in requesting your return"+error, status:200})
//     }
//     return NextResponse.json({success:true, message:"",status:200});
// }