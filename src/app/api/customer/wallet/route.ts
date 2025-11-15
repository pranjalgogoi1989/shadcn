import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import  dbConnect  from "@/lib/dbConnect";
import Wallet from "@/models/Wallet";
import User from "@/models/User";

export async function GET(req: NextRequest){
    const session = await getServerSession();
    if(!session){
        return NextResponse.json({success:false, message:'User not logged in', status:400});
    }
    try {     
        await dbConnect();
        const user = await User.findOne({email: session?.user?.email});
        if(!user){
            return NextResponse.json({success:false, message:'User not found', status:400});
        }
        const wallet = await Wallet.find({userId: user._id}).lean();
        return NextResponse.json({ success: true, message: "Wallet details found", wallet:wallet, status:200 });
    } catch (error) {
        return NextResponse.json({success:false, message:'Something went wrong', status:400});
    }
}