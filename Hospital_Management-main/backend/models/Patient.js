// backend/models/Patient.js
import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    age: { type: Number },
    disease: { type: String },
    address: { type: String },
    gender: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);
