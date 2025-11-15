
import mongoose from 'mongoose';

const ReturnSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    itemId: { type: String, required: true},
    reason: { type: String, required:true},
    status: { type: String, required:true},
  },
  { timestamps: true,}
);

export default mongoose.models.Return || mongoose.model('Return', ReturnSchema);

