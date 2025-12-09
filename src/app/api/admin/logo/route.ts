import { NextRequest, NextResponse } from "next/server";
import formidable from "formidable";
import { Readable } from "stream";
import fs from "fs";
import path from "path";
import dbConnect from "@/lib/dbConnect";
import Logo from "@/models/Logo";

const uploadDir = "./public/images/logo";
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
    await dbConnect();
    const logo = await Logo.findOne({title: "logo"});
    return NextResponse.json(logo, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching logo:", error);
    return NextResponse.json({ error: "Failed to fetch logo" }, { status: 500 });
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
        const newFilename = "logo" + path.extname(file.originalFilename || "");
        const newPath = path.join(uploadDir, newFilename);
        fs.renameSync(oldPath, newPath);
        resolve({ fields, file: { ...file, filepath: newPath, newFilename } });
        });
    });
    const newPath = "/images/logo/" + data.file.newFilename; //
    const findRecord= await Logo.findOne({title: "logo"});
    if (!findRecord) {
        const user = await Logo.create({title: "logo", image: newPath});
    }
    return NextResponse.json({ success: true, message: "Logo saved successfully",status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}