import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserAddress from "@/models/UserAddress";
import User from "@/models/User";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id"); 
  if(!id) return NextResponse.json({ error: "User ID required" }, { status: 400 });
  try {
    await dbConnect();
    const usersaddress = await UserAddress.find({user_id: id});
    if(!usersaddress) return NextResponse.json({ error: "Shipping Address Details not found" }, { status: 404 });
    return NextResponse.json(usersaddress, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching shipping address:", error);
    return NextResponse.json({ message: "Failed to fetch shipping address(s)" ,status: 500 });
  }
}


export async function POST(request:Request) {
  try {
    await dbConnect();
    const formdata = await request.json();
    console.log(formdata);
    const is_default = formdata.is_default;
    if (is_default) {
      await UserAddress.updateMany({ user_id: formdata.user_id }, { $set: { is_default: false } });
    }
    const address = await UserAddress.create({
        user_id: formdata.user_id,
        address_type: formdata.address_type,
        address_line_1: formdata.address_line_1,
        address_line_2: formdata.address_line_2,
        city: formdata.city,
        state: formdata.state,
        country: formdata.country,
        pincode: formdata.pincode,
        is_default:formdata.is_default
    });
    
    return NextResponse.json({message: "User Address Added Successfully.", status: 200 });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return NextResponse.json({ message: "Failed to save shipping address" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("id"); 
  console.log(user_id);
  try {
    await dbConnect();
    const formdata = await request.json();
    await UserAddress.updateMany({ user_id: user_id }, { $set: { is_default: false } });
    const address = await UserAddress.updateOne({ _id: formdata.key_id.id},{$set: {is_default: true}});
    return NextResponse.json({message: "User Address Updated Successfully.", status: 200 });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const formdata= await request.json();
    const adid= formdata.key_id.id;
    const data= await UserAddress.findOne({_id: adid});
    if(data && data.is_default ===true){
      return NextResponse.json({ error: "Default Address cannot be removed" }, { status: 404 });
    }
    const respo = await UserAddress.deleteOne({_id: adid});
    return NextResponse.json( { message: "User Address Removed Successfully.", status: 200 });
  } catch (error) {
    console.error("❌ Error deleting address:", error);
    return NextResponse.json({ error: "Failed to remove address" }, { status: 500 });
  }
}