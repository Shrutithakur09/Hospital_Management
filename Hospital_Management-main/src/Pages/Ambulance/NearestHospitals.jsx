// src/Pages/Ambulance/NearestHospitals.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import AmbulanceMap from "./AmbulanceMap";

const API_BASE = "https://hospital-management-16wx.onrender.com";

const NearestHospitals = () => {
  const [lat, setLat] = useState(30.356); // sample: Patiala area
  const [lng, setLng] = useState(76.386);
  const [radiusKm, setRadiusKm] = useState(5);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // 👈 selected hospital + distance
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const loadHospitals = async () => {
    setLoading(true);
    setMsg("");
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        radiusKm: radiusKm.toString(),
      });
      const res = await fetch(`${API_BASE}/api/hospitals/nearby?${params}`);
      if (!res.ok) {
        throw new Error("Failed to load");
      }
      const data = await res.json();
      setItems(data);

      if (!data.length) {
        setMsg("No hospitals found in this radius.");
        setSelectedItem(null);
      } else {
        // default: sabse nearest hospital ko select karo
        setSelectedItem(data[0]);
      }
    } catch (err) {
      console.error(err);
      setMsg("Failed to load hospitals.");
      setSelectedItem(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHospitals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Map ke liye derived values
  const selectedHospital = selectedItem?.hospital || null;
  const userLocation = { lat, lng };

  // simple ETA formula: distance * 2 minutes, at least 2 min
  const etaMinutes =
    selectedItem && typeof selectedItem.distanceKm === "number"
      ? Math.max(2, Math.round(selectedItem.distanceKm * 2))
      : undefined;

  // abhi ke liye dummy ambulance data; baad me backend se aayega
  const ambulance =
    selectedHospital != null
      ? {
          vehicleNumber: "PB-11 AQ 1234",
          driverName: "Rajiv",
          driverPhone: "98765 45876",
        }
      : undefined;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        🏥 Nearest Hospitals
      </Typography>

      {/* Patient location + radius controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Patient Location (for distance calculation)
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField
            label="Latitude"
            type="number"
            value={lat}
            onChange={(e) => setLat(Number(e.target.value))}
            size="small"
          />
          <TextField
            label="Longitude"
            type="number"
            value={lng}
            onChange={(e) => setLng(Number(e.target.value))}
            size="small"
          />
          <TextField
            label="Radius (km)"
            type="number"
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            size="small"
          />
          <Button variant="contained" onClick={loadHospitals} disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </Button>
        </Box>
      </Paper>

      {msg && (
        <Typography sx={{ mb: 1 }} color="text.secondary">
          {msg}
        </Typography>
      )}

      {/* LEFT: table, RIGHT: map */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.5fr 1.5fr" },
          gap: 2,
          alignItems: "flex-start",
        }}
      >
        {/* TABLE SIDE */}
        <Paper sx={{ p: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Beds Available</TableCell>
                <TableCell>Ambulance</TableCell>
                <TableCell>Distance (km)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, idx) => (
                <TableRow
                  key={idx}
                  hover
                  selected={selectedItem === item}
                  onClick={() => setSelectedItem(item)} // 👈 row click → map update
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{item.hospital.name}</TableCell>
                  <TableCell>{item.hospital.address}</TableCell>
                  <TableCell>
                    {item.hospital.city}, {item.hospital.state}
                  </TableCell>
                  <TableCell>{item.hospital.phoneNumber}</TableCell>
                  <TableCell>
                    {item.hospital.bedsAvailable ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>
                    {item.hospital.ambulanceAvailable ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>{item.distanceKm.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {items.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7}>No hospitals to show.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>

        {/* MAP SIDE */}
        <AmbulanceMap
          hospital={selectedHospital}
          userLocation={userLocation}
          ambulance={ambulance}
          etaMinutes={etaMinutes}
          status="Available"
        />
      </Box>
    </Box>
  );
};

export default NearestHospitals;
