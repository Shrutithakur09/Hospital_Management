// backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";

import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import ambulanceRoutes from "./routes/ambulanceRoutes.js";

import { importHospitalsFromCSV } from "./utils/csvLoader.js";

dotenv.config();

// MongoDB se connect
connectDB();

// ✅ Mongo open hote hi CSV import
mongoose.connection.once("open", async () => {
  console.log("MongoDB connected (index.js se)");
  try {
    await importHospitalsFromCSV(); // CSV → MongoDB
  } catch (err) {
    console.error("Error importing hospitals CSV:", err);
  }
});

const app = express();

/*
 * ✅ CORS FIX
 * Ab koi bhi frontend origin (localhost + Netlify + Render) se call kar sakta hai.
 * Demo / project ke liye theek hai. Agar baad me strict rakhna ho to
 * origin: ["http://localhost:5173", "https://hospital-mgmt-frontend.netlify.app"] etc. kar sakti ho.
 */
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/ambulances", ambulanceRoutes);
app.use("/api", feedbackRoutes);

app.get("/", (req, res) => res.send("Hospital Backend Running ✔"));

// ✅ Render / cloud ke liye PORT env se lo
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} (Render URL: https://hospital-management-16wx.onrender.com)`
  );
});
