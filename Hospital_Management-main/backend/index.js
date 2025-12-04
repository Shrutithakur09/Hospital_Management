// backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";              // ✅ NEW
import connectDB from "./config/db.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";


import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import ambulanceRoutes from "./routes/ambulanceRoutes.js";


import { importHospitalsFromCSV } from "./utils/csvLoader.js";
   // ✅ NEW

dotenv.config();
connectDB();

// ✅ Jab MongoDB connect ho jaye tab CSV se hospitals import karo
mongoose.connection.once("open", async () => {
  console.log("MongoDB connected (index.js se)");
  try {
    await importHospitalsFromCSV();              // CSV → MongoDB
  } catch (err) {
    console.error("Error importing hospitals CSV:", err);
  }
});

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/ambulances", ambulanceRoutes);
app.use("/api", feedbackRoutes);


app.get("/", (req, res) => res.send("Hospital Backend Running ✔"));

app.listen(5000, () =>
  console.log("Server running on https://hospital-management-16wx.onrender.com")
);
