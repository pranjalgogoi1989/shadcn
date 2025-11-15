import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  cat_name: string;
  slug: string;
  description?: string;
  parent?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    cat_name: {type: String, required: [true, 'Please provide category name'], trim: true, maxlength: [50, 'Category name cannot exceed 50 characters'],},
    slug: { type: String, required: true, unique: true, lowercase: true,index: true, },
    description: {type: String,maxlength: [500, 'Description cannot exceed 500 characters'],},
    parent: {type: mongoose.Schema.Types.ObjectId, ref: 'Category',},
  },
  { timestamps: true,}
);

const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;