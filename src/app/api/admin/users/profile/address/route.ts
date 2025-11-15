import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
//import User from "@/models/User";
import UserInfo from "@/models/UserInfo";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id"); 
  if(!id) return NextResponse.json({ error: "User ID required" }, { status: 400 });
  try {
    await dbConnect();
    const usersaddress = await UserInfo.findOne({user_id: id});
    if(!usersaddress) return NextResponse.json({ error: "User Address Details not found" }, { status: 404 });
    return NextResponse.json(usersaddress.address, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
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
            address:{
                address_line_1: formdata.address_line_1,
                address_line_2: formdata.address_line_2,
                city: formdata.city,
                state: formdata.state,
                country: formdata.country,
                pincode: formdata.pincode,
              },
          }
        },
      );
    } else {
      user = await UserInfo.create({
        user_id: formdata.user_id,
        first_name: " ", // ⚡ put required fields here or from req
        last_name: " ",
        email: " ",
        phone: " ",
        bio:" ",
        photo:"/images/user/owner.jpg",
        address: {
          address_line_1: formdata.address_line_1,
          address_line_2: formdata.address_line_2,
          city: formdata.city,
          state: formdata.state,
          country: formdata.country,
          pincode: formdata.pincode,
        },
        social_media: {
          facebook: "https://www.facebook.com",
          twitter: "https://www.x.com",
          linkedin: "https://www.linkedin.com",
          instagram:"https://www.instagram.com",
        }
      });
    }
    return NextResponse.json(user,{ status: 200 });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
