// backend/controllers/doctorController.js
import Doctor from "../models/Doctor.js";

// GET /api/doctors  – list sab doctors
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};

// POST /api/doctors – add new doctor
export const createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      fee,
      age,
      specialization,
      address,
      gender,
      availableTime,
    } = req.body;

    if (!name || !specialization) {
      return res
        .status(400)
        .json({ message: "Name and specialization are required" });
    }

    const doctor = await Doctor.create({
      name,
      email,
      phone,
      fee,
      age,
      specialization,
      address,
      gender,
      availableTime,
    });

    res.status(201).json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create doctor" });
  }
};

// DELETE /api/doctors/:id – (delete ke liye aage use karenge)
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    await Doctor.findByIdAndDelete(id);
    res.json({ message: "Doctor deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete doctor" });
  }
};
