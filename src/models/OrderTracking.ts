import mongoose, {Document} from "mongoose";

export interface IOrderTracking extends Document {
    orderId: string;
    itemId: string;
    trackingVia: string;
    trackingNumber: string;
    status: string;
}

const OrderTrackingSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    itemId: { type: String, required:true },
    trackingVia: { type: String, required: false },
    trackingNumber: { type: String, required: false },
    status: { type: String,  required: true, default: "Waiting for Shipment" },
}
, { timestamps: true });

export default mongoose.models.OrderTracking || mongoose.model<IOrderTracking>("OrderTracking", OrderTrackingSchema);