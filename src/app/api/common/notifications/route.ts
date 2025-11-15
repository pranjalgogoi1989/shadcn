import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Notifications from "@/models/Notification";
import { getServerSession } from "next-auth";
import { read } from "fs";

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession();

    console.log("User ID:", session?.user?.email);
    const user = await User.findOne({ email: session?.user?.email });
    if(user){
      const notifications = await Notifications.find({$or: [{ target_audience: "All" },{ target_audience: user._id }] }).sort({ createdAt: -1 });;
      return NextResponse.json(notifications, { status: 200 });
    }
    const notifications = await Notifications.find({target_audience: "All"}).sort({ createdAt: -1 });;
    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
export async function POST(request:Request) {
  try {
    await dbConnect();
    const formdata = await request.json();
    const session = await getServerSession();
    const user = await User.findOne({ email: session?.user?.email });
    if(user){
      const notification = await Notifications.create({
        thumbnail: session?.user?.image,
        profile_id: user._id,
        fromUser: session?.user?.name,
        msgText: formdata.msgText,
        category: formdata.category,
        target_audience: formdata.target_audience,
        readStatus: false,
      });
      return NextResponse.json({message:'Notification sent.'},{ status: 200 });
    }
    
  } catch (error) {
    return NextResponse.json({ error: "Failed to send notification"+error }, { status: 500 });
  }
}