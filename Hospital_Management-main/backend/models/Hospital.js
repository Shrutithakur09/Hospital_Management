// backend/models/Hospital.js
import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },

    // from CSV: beds_available, phone_number, ambulance_available
    beds_available: { type: Number },
    phone_number: { type: String },
    ambulance_available: { type: Boolean },

    // coordinates from CSV: latitude, longitude
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("Hospital", hospitalSchema);
