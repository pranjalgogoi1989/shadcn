import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import Wishlist from "@/models/WishList";
import Product from "@/models/Product";

export async function GET() {
  await dbConnect();
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const wishlist = await Wishlist.findOne({ user_id: session.user.id }).populate("items.product_id");
  return NextResponse.json({ wishlist: wishlist || { items: [] } });
}

export async function POST(req: Request) {
  await dbConnect();
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { product_id } = await req.json();
  const product = await Product.findById(product_id);
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  let wishlist = await Wishlist.findOne({ user_id: session.user.id });
  if (!wishlist) wishlist = new Wishlist({ user_id: session.user.id, items: [] });

  const exists = wishlist.items.some((item) => item.product_id.equals(product._id));
  if (exists) return NextResponse.json({ message: "Already in wishlist" });

  wishlist.items.push({
    product_id: product._id,
  });

  await wishlist.save();
  return NextResponse.json({ message: "Added to wishlist", wishlist });
}

export async function DELETE(req: Request) {
  await dbConnect();
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { product_id } = await req.json();
  const wishlist = await Wishlist.findOne({ user_id: session.user.id });
  if (!wishlist) return NextResponse.json({ message: "Wishlist empty" });

  wishlist.items = wishlist.items.filter((item) => !item.product_id.equals(product_id));
  await wishlist.save();

  return NextResponse.json({ message: "Removed from wishlist", wishlist });
}