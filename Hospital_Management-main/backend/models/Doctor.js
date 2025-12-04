// backend/models/Doctor.js
import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    fee: { type: Number },
    age: { type: Number },
    specialization: { type: String, required: true }, // UI me label "Specialist"
    address: { type: String },
    gender: { type: String },
    availableTime: { type: String }, // e.g. "8pm-10pm"
    isApproved: { type: Boolean, default: true }, // future use for Approval tab
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
