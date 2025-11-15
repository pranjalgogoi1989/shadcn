
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import Wishlist from "@/models/WishList";
import User from "@/models/User";

export async function POST(req: Request) {
    const session = await getServerSession();
    await dbConnect();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await User.findOne({ email: session?.user?.email });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const user_id = user._id;
    const { localWishlist } = await req.json();
    if (!Array.isArray(localWishlist)) {
        return NextResponse.json({ error: "Invalid wishlist data" }, { status: 400 });
    }

    let wishlist = await Wishlist.findOne({ user_id: user_id });
    if (!wishlist) {
        wishlist = new Wishlist({
        user_id: user_id,
        items: [],
        });
    }
    // Merge local wishlist into DB wishlist without duplicates
    const existingIds = wishlist.items.map((item: any) => item.product_id.toString());
    localWishlist.forEach((localItem) => {
        if (!existingIds.includes(localItem.product_id)) {
        wishlist.items.push(localItem);
        }
    });
    await wishlist.save();
    return NextResponse.json({ message: "Wishlist synced successfully", wishlist });
}