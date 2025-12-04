// backend/routes/ambulanceRoutes.js
import express from "express";
import {
  getAmbulances,
  getAvailableAmbulances,
  createAmbulance,
  updateAmbulance,
  getEta,
} from "../controllers/ambulanceController.js";

const router = express.Router();

router.get("/", getAmbulances);
router.get("/available", getAvailableAmbulances);
router.post("/", createAmbulance);
router.patch("/:id", updateAmbulance);
router.get("/eta", getEta);

export default router;
