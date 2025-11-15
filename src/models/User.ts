import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name:string;
  email:string;
  password:string;
  plain_password:string;
  image:string;
  role:string;
  createdAt:Date;
  updatedAt:Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    plain_password: {type:String, required:true},
    image:{type: String, required: false, default:"/images/user.png"},
    role:{type: String, required: true},   // user, admin,seller etc.
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);