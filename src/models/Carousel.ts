import mongoose, { Schema, Document } from 'mongoose';

export interface ICarousel extends Document {
  image: string;
  title: string;
  description: string;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

const CarouselSchema = new Schema<ICarousel>(
  {
    image: { type: String, required: [true, "Please provide image with proper size and dimension"] },
    title: { type: String, required: [true, "Please suggest a title for the carousel Item" ], trim: true, maxlength: [150, 'Title cannot exceed 150 characters'],},
    description: { type: String, required: [true,"Please provide a description for the carousel item"], trim: true, maxlength: [500, 'Description cannot exceed 500 characters'],},
    priority: { type: Number, required:[true,"Please provide a priority for the carousel item"], default: 0 },
  },
  { timestamps: true,}
);

export default mongoose.models.Carousel || mongoose.model<ICarousel>('Carousel', CarouselSchema);
