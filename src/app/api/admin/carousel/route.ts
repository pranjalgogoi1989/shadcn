import { NextRequest, NextResponse } from "next/server";
import Carousel  from "@/models/Carousel";
import formidable from "formidable";
import { Readable } from "stream";
import fs from "fs";
import path from "path";
import  dbConnect  from "@/lib/dbConnect";

const uploadDir = "./public/carousel";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

function toNodeRequest(req: NextRequest) {
  const body = Readable.fromWeb(req.body as any);
  return Object.assign(body, {
    headers: Object.fromEntries(req.headers),
    method: req.method,
    url: req.url,
  });
}

export async function GET() {
    try {
        dbConnect();
        const carousel = await Carousel.find({}).sort({priority: 1});
        return NextResponse.json(carousel, { status: 200 });
    } catch (error) {
        console.error("❌ Error fetching carousel items:", error);
        return NextResponse.json({ error: "Failed to fetch carousel item" }, { status: 500 });
    }
}  
export async function POST(req: NextRequest) {
        
    try {
        await dbConnect();
        const nodeReq = toNodeRequest(req);
        const form = formidable({ multiples: false, uploadDir, keepExtensions: true, });
        const data: any = await new Promise((resolve, reject) => {
          form.parse(nodeReq, (err, fields, files) => {
            if (err) return reject(err);
            const file = Array.isArray(files.file) ? files.file[0] : files.file;
            if (!file) return reject(new Error("No file uploaded"));
            const oldPath = file.filepath;
            const newFilename = Date.now() + path.extname(file.originalFilename || "");
            const newPath = path.join(uploadDir, newFilename);
            fs.renameSync(oldPath, newPath);
            resolve({ fields, file: { ...file, filepath: newPath, newFilename } });
          });
        });
    
        //const username = data.fields.username?.[0] || "default";
        const title = data.fields.title?.[0] || "default";
        const description = data.fields.description?.[0] || "default";
        const priority = data.fields.priority?.[0] || "default";
        
        const newPath = "/carousel/" + data.file.newFilename; //
        const findRecord= await Carousel.create({image: newPath, title, description, priority});
        return NextResponse.json({ success: true,message: "Carousel item saved successfully", status: 200 });
      } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
      }


}

export async function DELETE(req: NextRequest) {
    const body = await req.json();
    const {key_id} = body;
    if(!key_id) return NextResponse.json({ message: "Carousel Item not found" ,status: 404 });
    try {
        dbConnect();
        const result = await Carousel.findOne({_id: key_id});
        const filePath = path.join(process.cwd(), 'public', result.image);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        const results = await Carousel.deleteOne({_id: key_id});
        return NextResponse.json({message:'Carousel item deleted successfully', status: 200 });
    } catch (error) {
        console.error("❌ Error fetching carousel items:", error);
        return NextResponse.json({ error: "Failed to fetch carousel items" }, { status: 500 });
    }
}