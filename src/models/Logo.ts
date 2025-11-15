import mongoose, { Schema, Document } from 'mongoose';

export interface ILogo extends Document {
  title:string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const LogoSchema = new Schema<ILogo>(
  {
    title: {type: String, required: true, default:'logo'},
    image: {type: String, required: [true, 'Please provide image'],},
  },
  { timestamps: true,}
);

const Logo = mongoose.models.Logo || mongoose.model<ILogo>('Logo', LogoSchema);

export default Logo;