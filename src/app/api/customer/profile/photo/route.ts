import { NextRequest, NextResponse } from "next/server";
import formidable from "formidable";
import { Readable } from "stream";
import fs from "fs";
import path from "path";
import dbConnect from "@/lib/dbConnect";
import UserInfo from "@/models/UserInfo";
import User from "@/models/User";

const uploadDir = "./public/images/user";
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

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const nodeReq = toNodeRequest(req);
    const form = formidable({ multiples: false, uploadDir, keepExtensions: true, });
    const data: any = await new Promise((resolve, reject) => {
      form.parse(nodeReq, (err, fields, files) => {
        if (err) return reject(err);
        const username = fields.username?.[0] || "default";
        const file = Array.isArray(files.file) ? files.file[0] : files.file;
        if (!file) return reject(new Error("No file uploaded"));
        const oldPath = file.filepath;
        const newFilename = username + path.extname(file.originalFilename || "");
        const newPath = path.join(uploadDir, newFilename);
        fs.renameSync(oldPath, newPath);
        resolve({ fields, file: { ...file, filepath: newPath, newFilename } });
      });
    });

    const username = data.fields.username?.[0] || "default";
    const newPath = "/images/user/" + data.file.newFilename; //
    const findRecord= await UserInfo.findOne({user_id: username});
    if (findRecord) {
      const user = await UserInfo.findOneAndUpdate(findRecord._id,{ $set: { photo: newPath, }});
      const profile = await User.findOneAndUpdate(findRecord.user_id,{ $set: { image: newPath, }});
    }
    return NextResponse.json({ success: true, data: newPath }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}