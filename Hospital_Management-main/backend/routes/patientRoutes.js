// backend/routes/patientRoutes.js
import express from "express";
import {
  getPatients,
  getPatientById,
  createPatient,
} from "../controllers/patientController.js";

const router = express.Router();

router.get("/", getPatients);
router.get("/:id", getPatientById);
router.post("/", createPatient);

export default router;
