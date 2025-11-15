import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Please provide valid brand name"] },
    description: { type: String, required: [true,"Please provide a description for the brand"], trim: true, maxlength: [500, 'Description cannot exceed 500 characters'],},
    dealsWith: { type: String, required:[true,"Please provide a type of products that the brand deals with"]},
  },
  { timestamps: true,}
);

export default mongoose.models.Brand || mongoose.model('Brand', BrandSchema);

