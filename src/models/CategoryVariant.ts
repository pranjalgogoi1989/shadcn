import mongoose from "mongoose";

const FieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["text", "number", "select"], default: "text" },
  options: [{ type: String }], // used when type is "select"
});

const CategoryVariantSchema = new mongoose.Schema(
  {
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    categoryName: { type: String, required: true },
    variantFields: [FieldSchema], // e.g. [{ name: "Color", type: "select", options: ["Red", "Blue"] }]
  },
  { timestamps: true }
);

export default mongoose.models.CategoryVariant ||
  mongoose.model("CategoryVariant", CategoryVariantSchema);