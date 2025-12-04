// backend/controllers/hospitalController.js
import Hospital from "../models/Hospital.js";
import { distanceKm } from "../utils/geo.js";

// GET /api/hospitals  -> list all
export const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (err) {
    console.error("getHospitals error:", err);
    res.status(500).json({ message: "Failed to fetch hospitals" });
  }
};

// GET /api/hospitals/nearby?lat=..&lng=..&radiusKm=5
export const getNearbyHospitals = async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const radiusKm = parseFloat(req.query.radiusKm || "5");

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res
        .status(400)
        .json({ message: "lat and lng query params are required" });
    }

    // 1) Saare hospitals le lo
    const hospitals = await Hospital.find();

    console.log(
      "Nearby query:",
      { lat, lng, radiusKm },
      "hospitals in DB:",
      hospitals.length
    );

    // 2) Distance calculate + radius filter
    const nearbyRaw = hospitals
      .map((h) => {
        let hospLat = null;
        let hospLng = null;

        // ✅ GeoJSON location field se coordinates
        if (h.location && Array.isArray(h.location.coordinates)) {
          // GeoJSON order: [lng, lat]
          hospLng = Number(h.location.coordinates[0]);
          hospLat = Number(h.location.coordinates[1]);
        }

        // ✅ Agar direct latitude/longitude fields bhi hon to fallback
        if (h.latitude != null && h.longitude != null) {
          hospLat = Number(h.latitude);
          hospLng = Number(h.longitude);
        }

        // Agar coordinates hi nahi mile to skip
        if (
          hospLat == null ||
          hospLng == null ||
          Number.isNaN(hospLat) ||
          Number.isNaN(hospLng)
        ) {
          return null;
        }

        const d = distanceKm(lat, lng, hospLat, hospLng);
        return { hospital: h, distanceKm: d };
      })
      .filter((item) => item !== null && item.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    // 3) ✅ FRONTEND-FRIENDLY RESPONSE SHAPE
    //    snake_case -> camelCase convert karke return karo
    const nearby = nearbyRaw.map((item) => {
      const h = item.hospital;

      return {
        hospital: {
          id: h._id,
          name: h.name,
          address: h.address,
          city: h.city,
          state: h.state,
          pincode: h.pincode,
          phoneNumber: h.phone_number ?? h.phoneNumber ?? "",
          bedsAvailable: h.beds_available ?? h.bedsAvailable ?? 0,
          ambulanceAvailable:
            h.ambulance_available ?? h.ambulanceAvailable ?? false,
          latitude: h.latitude,
          longitude: h.longitude,
        },
        distanceKm: Number(item.distanceKm.toFixed(2)),
      };
    });

    res.json(nearby);
  } catch (err) {
    console.error("getNearbyHospitals error:", err);
    res.status(500).json({ message: "Failed to fetch nearby hospitals" });
  }
};
