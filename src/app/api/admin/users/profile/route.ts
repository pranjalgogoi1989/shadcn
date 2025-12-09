import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserInfo from "@/models/UserInfo";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id"); 
  if(!id) return NextResponse.json({ error: "User ID required" ,status: 400 });
  try {
    await dbConnect();
    const data = await UserInfo.findOne({user_id: id});
    if(!data) return NextResponse.json({ error: "User Details not found" ,status: 404 });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" ,status: 500 });
  }
}