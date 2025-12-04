// backend/controllers/patientController.js
import Patient from "../models/Patient.js";

// GET /api/patients
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
};

// GET /api/patients/:id  (PatientDetails ke liye future me)
export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch patient" });
  }
};

// POST /api/patients
export const createPatient = async (req, res) => {
  try {
    const { name, email, phone, age, disease, address, gender } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const patient = await Patient.create({
      name,
      email,
      phone,
      age,
      disease,
      address,
      gender,
    });

    res.status(201).json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create patient" });
  }
};
