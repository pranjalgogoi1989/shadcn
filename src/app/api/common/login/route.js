import dbConnect from "@/lib/dbConnect";
import User from "@/models/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ success: false, message: "Email and password required" }), { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ success: false, message: "Invalid credentials" }), { status: 401 });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ success: false, message: "Invalid credentials" }), { status: 401 });
    }
    

    const token = jwt.sign(
      { userId: user._id, email: user.email, role:user.role  },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return new Response(JSON.stringify({ success: true, token }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}