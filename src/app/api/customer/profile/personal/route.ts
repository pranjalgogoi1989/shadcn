import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserInfo from "@/models/UserInfo";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id"); 
  if(!id) return NextResponse.json({ error: "User ID required" }, { status: 400 });
  try {
    await dbConnect();
    const usersaddress = await UserInfo.findOne({user_id: id});
    if(!usersaddress) return NextResponse.json({ error: "User Personal Details not found" }, { status: 404 });
    return NextResponse.json(usersaddress, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch personal details" }, { status: 500 });
  }
}


export async function POST(request:Request) {
  try {
    await dbConnect();
    const formdata = await request.json();
    let user;
    const findRecord=await UserInfo.findOne({user_id: formdata.user_id});
    if (findRecord) {
      user = await UserInfo.findByIdAndUpdate(
        findRecord._id,
        { $set: { 
            first_name: formdata.first_name,
            last_name: formdata.last_name,
            email: formdata.email,
            phone: formdata.phone,
            bio:formdata.bio,
          }
        },
      );
    } else {
      user = await UserInfo.create({
        user_id: formdata.user_id,
        first_name: formdata.first_name, // ⚡ put required fields here or from req
        last_name: formdata.last_name,
        email: formdata.email,
        phone: formdata.phone,
        bio:formdata.bio,
        photo:"/images/user/owner.jpg",
        address: {
          address_line_1: "",
          address_line_2: " ",
          city: " ",
          state: " ",
          country: " ",
          pincode: " ",
        },
        social_media: {
          facebook:"https://www.facebook.com",
          twitter:"https://www.x.com",
          linkedin:"https://www.linkedin.com",
          instagram:"https://www.instagram.com",
        }
      });
    }
    return NextResponse.json(user,{ status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch personal details" }, { status: 500 });
  }
}