// backend/routes/doctorRoutes.js
import express from "express";
import {
  getDoctors,
  createDoctor,
  deleteDoctor,
} from "../controllers/doctorController.js";

const router = express.Router();

// /api/doctors
router.get("/", getDoctors);        // GET all
router.post("/", createDoctor);     // POST new
router.delete("/:id", deleteDoctor); // DELETE by id

export default router;
