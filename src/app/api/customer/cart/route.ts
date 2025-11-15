import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import { getServerSession } from "next-auth";
import User from "@/models/User";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({success:false, messsage:"Please Login First", status:400});

  await dbConnect();
  const user = await User.findOne({email: session.user.email});
  if(!user) return NextResponse.json({success:false, messsage:"Please Login First", status:400});
  const cart = await Cart.findOne({ userId: user._id });
  if(!cart) return NextResponse.json({success:false, message:"No Items in cart", status:200});
  return NextResponse.json({success:true, cart:cart, status:200 });
}

export async function PUT(req:NextRequest){
  const {productId } = await req.json();
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({success:false, messsage:"Please Login First", status:400});
  await dbConnect();
  const user = await User.findOne({email: session.user.email});
  if(!user) return NextResponse.json({success:false, messsage:"Please Login First", status:400});
  await Cart.updateOne(
    { userId: user._id },
    { $pull: { items: { _id: productId } } }
  );

  return NextResponse.json({success:true,message:"Cart Updated Successfully",status:200})
}
