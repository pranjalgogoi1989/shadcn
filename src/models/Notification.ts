import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {    
    thumbnail: {type: String, required:true},
    profile_id: { type: String, required: true },
    fromUser: { type: String, required: true},
    msgText: { type: String, required: true },
    category: {type:String, required:true},
    target_audience: { type: String, required: true },  /** "All", "Specific Users" */
    readStatus: { type: Boolean, default: false },
    postTime: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);