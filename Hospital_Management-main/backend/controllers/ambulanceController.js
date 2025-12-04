// backend/controllers/ambulanceController.js
import Ambulance from "../models/Ambulance.js";
import Hospital from "../models/Hospital.js";
import { distanceKm, estimateEtaMinutes } from "../utils/geo.js";

// GET /api/ambulances
export const getAmbulances = async (_req, res) => {
  try {
    const ambulances = await Ambulance.find().populate("hospital");
    res.json(ambulances);
  } catch (err) {
    console.error("GET AMBULANCES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch ambulances" });
  }
};

// GET /api/ambulances/available
export const getAvailableAmbulances = async (_req, res) => {
  try {
    const ambulances = await Ambulance.find({ status: "available" }).populate(
      "hospital"
    );
    res.json(ambulances);
  } catch (err) {
    console.error("GET AVAILABLE AMBULANCES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch available ambulances" });
  }
};

// POST /api/ambulances  – add new ambulance
export const createAmbulance = async (req, res) => {
  try {
    const {
      hospitalId,
      vehicleNumber,
      driverName,
      driverPhone,
      currentLatitude,
      currentLongitude,
      status,
    } = req.body;

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(400).json({ message: "Invalid hospitalId" });
    }

    const amb = await Ambulance.create({
      hospital: hospitalId,
      vehicleNumber,
      driverName,
      driverPhone,
      currentLatitude,
      currentLongitude,
      status,
    });

    res.status(201).json(amb);
  } catch (err) {
    console.error("CREATE AMBULANCE ERROR:", err);
    res.status(500).json({ message: "Failed to create ambulance" });
  }
};

// PATCH /api/ambulances/:id  – update location/status
export const updateAmbulance = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      currentLatitude,
      currentLongitude,
      status,
    } = req.body;

    const updated = await Ambulance.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(currentLatitude !== undefined && { currentLatitude }),
          ...(currentLongitude !== undefined && { currentLongitude }),
          ...(status && { status }),
        },
      },
      { new: true }
    ).populate("hospital");

    if (!updated) {
      return res.status(404).json({ message: "Ambulance not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("UPDATE AMBULANCE ERROR:", err);
    res.status(500).json({ message: "Failed to update ambulance" });
  }
};

// GET /api/ambulances/eta?ambulanceId=&lat=&lng=
export const getEta = async (req, res) => {
  try {
    const { ambulanceId, lat, lng } = req.query;

    if (!ambulanceId || !lat || !lng) {
      return res.status(400).json({
        message: "ambulanceId, lat and lng are required",
      });
    }

    const amb = await Ambulance.findById(ambulanceId).populate("hospital");
    if (!amb) {
      return res.status(404).json({ message: "Ambulance not found" });
    }

    if (
      typeof amb.currentLatitude !== "number" ||
      typeof amb.currentLongitude !== "number"
    ) {
      return res.status(400).json({
        message: "Ambulance location not available",
      });
    }

    const dist = distanceKm(
      amb.currentLatitude,
      amb.currentLongitude,
      Number(lat),
      Number(lng)
    );

    const eta = estimateEtaMinutes(dist);

    res.json({
      ambulanceId: amb._id,
      distanceKm: Number(dist.toFixed(2)),
      etaMinutes: eta,
      ambulance: amb,
    });
  } catch (err) {
    console.error("ETA ERROR:", err);
    res.status(500).json({ message: "Failed to calculate ETA" });
  }
};
