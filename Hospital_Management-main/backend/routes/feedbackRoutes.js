// routes/feedbackRoutes.js
import express from "express";
import { createFeedback } from "../controllers/feedbackController.js";

const router = express.Router();

// POST /api/feedback
router.post("/feedback", createFeedback);

export default router;
