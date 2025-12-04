// src/Pages/Ambulance/AmbulanceMap.jsx
import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "../../leafletIcons"; // marker icons fix

const DEFAULT_CENTER = [30.356, 76.386]; // fallback centre (Thapar ke aas-paas)

/**
 * Props expected:
 *  - hospital:  {
 *        name: string,
 *        latitude: number,
 *        longitude: number,
 *        ... (CSV se jo bhi aaya ho)
 *    }
 *  - ambulance: {
 *        vehicleNumber: string,
 *        driverName: string,
 *        driverPhone: string
 *    }  // (ye bhi backend se aa sakta hai)
 *  - userLocation: { lat: number, lng: number }
 *  - etaMinutes: number
 *  - status: "Available" | "On the way" | "Busy"
 */
const AmbulanceMap = ({
  hospital,
  ambulance,
  userLocation,
  etaMinutes,
  status = "Available",
}) => {
  // ❗ CSV-friendly: agar hospital hi nahi mila to user ko message dikhao
  if (!hospital) {
    return (
      <Paper sx={{ p: 2, minHeight: 200 }}>
        <Typography variant="h6" gutterBottom>
          Ambulance & Hospital Map
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please select a hospital from the list to see its location and route.
        </Typography>
      </Paper>
    );
  }

  const hospitalPos = [
    hospital.latitude ?? DEFAULT_CENTER[0],
    hospital.longitude ?? DEFAULT_CENTER[1],
  ];

  const userPos = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [DEFAULT_CENTER[0] + 0.001, DEFAULT_CENTER[1] + 0.001];

  const polylinePositions = [hospitalPos, userPos];

  const statusClass =
    status.toLowerCase() === "available" ? "status-available" : "status-busy";

  return (
    <Paper sx={{ p: 2, minHeight: 360 }}>
      <Typography variant="h6" gutterBottom>
        Ambulance Details
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.1fr 1.2fr" },
          gap: 2,
          alignItems: "stretch",
        }}
      >
        {/* LEFT: Details */}
        <Box>
          <Box sx={{ mb: 1 }}>
            <Typography variant="subtitle2">Hospital:</Typography>
            <Typography variant="body1">{hospital.name}</Typography>
          </Box>

          <Box sx={{ mb: 1 }}>
            <Typography variant="subtitle2">Vehicle Number:</Typography>
            <Typography variant="body1">
              {ambulance?.vehicleNumber || "—"}
            </Typography>
          </Box>

          <Box sx={{ mb: 1 }}>
            <Typography variant="subtitle2">Driver Name:</Typography>
            <Typography variant="body1">
              {ambulance?.driverName || "—"}
            </Typography>
          </Box>

          <Box sx={{ mb: 1 }}>
            <Typography variant="subtitle2">Driver Phone:</Typography>
            <Typography variant="body1">
              {ambulance?.driverPhone || "—"}
            </Typography>
          </Box>

          <Box sx={{ mb: 1 }}>
            <Typography variant="subtitle2">Status:</Typography>
            <Typography
              variant="body1"
              className={statusClass}
              sx={{
                color:
                  status.toLowerCase() === "available"
                    ? "success.main"
                    : "error.main",
                fontWeight: 600,
              }}
            >
              {status}
            </Typography>
          </Box>

          {etaMinutes != null && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle2">
                Estimated Arrival Time:
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "primary.main", fontWeight: 500 }}
              >
                {etaMinutes} minutes
              </Typography>
            </Box>
          )}
        </Box>

        {/* RIGHT: Map */}
        <Box>
          <MapContainer
            center={hospitalPos}
            zoom={16}
            scrollWheelZoom={false}
            style={{ height: 320, width: "100%", borderRadius: 12 }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Hospital (from CSV/Mongo) */}
            <Marker position={hospitalPos} icon={new L.Icon.Default()}>
              <Popup>{hospital.name}</Popup>
            </Marker>

            {/* User / patient */}
            <Marker position={userPos} icon={new L.Icon.Default()}>
              <Popup>Patient Location</Popup>
            </Marker>

            <Polyline positions={polylinePositions} />
          </MapContainer>
        </Box>
      </Box>
    </Paper>
  );
};

export default AmbulanceMap;
