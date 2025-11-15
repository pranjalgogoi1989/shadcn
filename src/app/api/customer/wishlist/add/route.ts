import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import Wishlist from "@/models/WishList";
import User from "@/models/User";

export async function POST(req: Request) {
  await dbConnect();
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {item}  = await req.json();
  if (!item?.product_id)
    return NextResponse.json({ error: "Invalid item" }, { status: 400 });

  const user = await User.find({ email: session.user.email });
  if(!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const user_id = user._id;
  let wishlist = await Wishlist.findOne({ user_id: user_id });
  console.log(wishlist);
  return NextResponse.json({ wishlist: wishlist || { items: [] } });

  if (!wishlist) {
    wishlist = new Wishlist({ user_id: user_id, items: [item] });
  } else {
    const exists = wishlist.items.some(
      (w: any) => String(w.product_id) === String(item.product_id)
    );
    if (!exists) wishlist.items.push(item);
  }
  console.log(wishlist);
  await wishlist.save();
  return NextResponse.json({ success: true });
}