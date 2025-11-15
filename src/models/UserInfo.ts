import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  address_line_1: { type: String},
  address_line_2: { type: String },
  city:           { type: String },
  state:          { type: String },
  country:        { type: String },
  pincode:        { type: String },
});

const SocialMediaSchema = new mongoose.Schema({
  facebook: { type: String, default: "https://www.facebook.com" },
  twitter:  { type: String, default: "https://www.x.com" },
  linkedin: { type: String, default: "https://www.linkedin.com" },
  instagram:{ type: String, default: "https://www.instagram.com" },
});

const UserInfoSchema = new mongoose.Schema(
  {
    user_id:    { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    first_name: { type: String},
    last_name:  { type: String}, // removed unique
    email:      { type: String}, // better to make email unique
    phone:      { type: String},

    bio:   { type: String },
    photo: { type: String },

    // Single object OR multiple addresses
    address: AddressSchema, // use array of objects
    social_media: SocialMediaSchema, // single object
  },
  { timestamps: true }
);

export default mongoose.models.UserInfo || mongoose.model("UserInfo", UserInfoSchema);