// backend/controllers/hospitalController.js
import Hospital from "../models/Hospital.js";

// ✅ Haversine helper (fallback ke liye – sirf tab use hoga jab DB me distance na mile)
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

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
    // radius filter ke liye
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const radiusKm = parseFloat(req.query.radiusKm || "5");

    const hospitals = await Hospital.find();

    console.log(
      "Nearby query:",
      { lat, lng, radiusKm },
      "hospitals in DB:",
      hospitals.length
    );

    const nearbyRaw = hospitals
      .map((h) => {
        // 👉 1) PEHLE DATABASE ME SE DISTANCE FIELD TRY KARO
        let d =
          h.distanceKm ??
          h.distance_km ??
          h.distance ??
          h.Distance ??
          null;

        if (d != null) {
          d = Number(d);
          if (Number.isNaN(d)) return null;
          return { hospital: h, distanceKm: d };
        }

        // 👉 2) Agar DB me distance nahi mila TOH fallback = calculate
        // (sirf isi case me calculation chalegi)
        if (Number.isNaN(lat) || Number.isNaN(lng)) {
          // patient location hi nahi di → distance nikal hi nahi sakte
          return null;
        }

        let hospLat = null;
        let hospLng = null;

        // GeoJSON location se
        if (h.location && Array.isArray(h.location.coordinates)) {
          // [lng, lat]
          hospLng = Number(h.location.coordinates[0]);
          hospLat = Number(h.location.coordinates[1]);
        }

        // direct latitude/longitude fields
        if (h.latitude != null && h.longitude != null) {
          hospLat = Number(h.latitude);
          hospLng = Number(h.longitude);
        }

        if (
          hospLat == null ||
          hospLng == null ||
          Number.isNaN(hospLat) ||
          Number.isNaN(hospLng)
        ) {
          return null;
        }

        const calcD = getDistanceKm(lat, lng, hospLat, hospLng);
        return { hospital: h, distanceKm: calcD };
      })
      // null hatao
      .filter((item) => item !== null)
      // radius filter (agar radiusKm number hai)
      .filter((item) =>
        Number.isNaN(radiusKm) ? true : item.distanceKm <= radiusKm
      )
      // nearest first
      .sort((a, b) => a.distanceKm - b.distanceKm);

    // 👉 3) FRONTEND-FRIENDLY RESPONSE
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
        // DB waali value / calculated value dono ko 2 decimal tak round
        distanceKm: Number(item.distanceKm.toFixed(2)),
      };
    });

    res.json(nearby);
  } catch (err) {
    console.error("getNearbyHospitals error:", err);
    res.status(500).json({ message: "Failed to fetch nearby hospitals" });
  }
};
