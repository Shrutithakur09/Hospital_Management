// backend/models/Ambulance.js
import mongoose from "mongoose";

const ambulanceSchema = new mongoose.Schema(
  {
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    vehicleNumber: String,
    driverName: String,
    driverPhone: String,
    currentLatitude: Number,
    currentLongitude: Number,
    status: {
      type: String,
      enum: ["available", "busy", "offline"],
      default: "available",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Ambulance", ambulanceSchema);
