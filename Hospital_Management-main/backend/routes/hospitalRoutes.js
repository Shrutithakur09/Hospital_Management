// backend/routes/hospitalRoutes.js
import express from "express";
import {
  getHospitals,
  getNearbyHospitals,
} from "../controllers/hospitalController.js";

const router = express.Router();

router.get("/", getHospitals);
router.get("/nearby", getNearbyHospitals);

export default router;
