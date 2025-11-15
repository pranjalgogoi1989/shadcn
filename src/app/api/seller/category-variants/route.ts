import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CategoryVariant from "@/models/CategoryVariant";
import Category from "@/models/Category";

// ✅ GET: Fetch all or one category variant
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    let result;
    if (categoryId) {
      result = await CategoryVariant.findOne({ categoryId });
    } else {
      result = await CategoryVariant.find().sort({ updatedAt: -1 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("GET CategoryVariant Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
 
}

// ✅ POST: Create or update category variant
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { categoryId, categoryName, fields } = body;
    if (!categoryId || !categoryName || !fields) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const updated = await CategoryVariant.findOneAndUpdate(
      { categoryId },
      { categoryName, variantFields: fields },
      { upsert: true, new: true }
    );
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Error saving category variant:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ DELETE: Remove category variant entry
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "id is required" },
        { status: 400 }
      );
    }

    await CategoryVariant.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error: any) {
    console.error("DELETE CategoryVariant Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}