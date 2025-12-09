import { NextRequest, NextResponse } from "next/server";
import Category from "@/models/Category";
import  dbConnect  from "@/lib/dbConnect";


export async function GET() {
    try {
        await dbConnect();
        const categories = await Category.find({});
        return NextResponse.json({data:categories, status: 200 });
    } catch (error) {
        console.error("❌ Error fetching product categories:", error);
        return NextResponse.json({ error: "Failed to fetch product categories" }, { status: 500 });
    }
}  
export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const { cat_name, parentId } = body;
        const slug = cat_name.toLowerCase().replace(/\s+/g, "-");
        const category = await Category.create({ cat_name, slug, parentId: parentId || null });
        return NextResponse.json(category);
    } catch (error) {
         console.error("❌ Error saving product categories:", error);
        return NextResponse.json({ error: "Failed to save product categories" }, { status: 500 });
    }
    
}

export async function DELETE(req: NextRequest) {
    const body = await req.json();
    const {key_id} = body;
    if(!key_id) return NextResponse.json({ message: "Category Id not found" ,status: 404 });
    try {
        await dbConnect();
        const result = await Category.deleteOne({_id: key_id});
        return NextResponse.json({message:'Category deleted successfully', status: 200 });
    } catch (error) {
        console.error("❌ Error fetching product categories:", error);
        return NextResponse.json({ error: "Failed to fetch product categories" }, { status: 500 });
    }
}