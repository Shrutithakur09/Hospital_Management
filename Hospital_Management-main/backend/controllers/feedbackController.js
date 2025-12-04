// controllers/feedbackController.js
import Feedback from "../models/feedback.js";

export const createFeedback = async (req, res) => {
  console.log("FEEDBACK HIT ====>", req.body);   // DEBUG

  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const fb = await Feedback.create({ name, email, subject, message });

    return res.status(201).json({
      message: "Feedback saved successfully",
      feedback: fb,
    });
  } catch (err) {
    console.error("FEEDBACK ERROR:", err);
    return res
      .status(500)
      .json({ message: "Server error while saving feedback" });
  }
};
