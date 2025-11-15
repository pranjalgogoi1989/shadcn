// import { NextRequest, NextResponse } from "next/server";
// import Review from "@/models/Review";
// import User from "@/models/User";
// import Order from "@/models/Order";
// import dbConnect from "@/lib/dbConnect";
// import { getServerSession } from "next-auth";

// export async function GET(req:NextRequest, {params}){
//     const {id}= await params;  //product id
//     const session = await getServerSession();
//     if(!session){
//         return NextResponse.json({success:false, message:'User not logged in', status:400});
//     }
//     const userSession = session.user;
//     const user = await User.findOne({email: userSession?.email});

//     const orders = await Order.find({userId: user._id.toString()}).lean();
//     if(!orders){
//         return NextResponse.json({success:false, message:'No Order found.',status:400});
//     }

//     const productIds = orders.map(order => order.items.map(item => item.productId));
//     //console.log(productIds);

//     //console.log("Received ID: ",id, user._id.toString());
//     if(!id){
//         await dbConnect();
//         const review = await Review.find({userId: user._id.toString(), productId: { $in: [id] }}).lean();
//         return NextResponse.json({success:false, message:'No Product Id found.',status:400});
//     }
//     try{

//         return NextResponse.json({success:true, review: '', status:200});
//     }catch(error){
//         return NextResponse.json({success:false, message:'Something went wrong',status:400});
//     }
// }