import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDeliveryPartner extends Document {
  partner_name: string;
  tracking_url : string;
  createdAt: Date;
  updatedAt: Date;
}

const DeliveryPartnerSchema = new Schema<IDeliveryPartner>(
  {
    partner_name: {type: String, required: [true, 'Please provide delivery partner name']},
    tracking_url: { type: String, required: true, lowercase: true},
  },
  { timestamps: true,}
);

const DeliveryPartner: Model<IDeliveryPartner> =
  mongoose.models.DeliveryPartner ||
  mongoose.model<IDeliveryPartner>("DeliveryPartner", DeliveryPartnerSchema);

export default DeliveryPartner;