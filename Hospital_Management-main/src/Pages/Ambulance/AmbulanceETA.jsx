// src/Pages/Ambulance/AmbulanceETA.jsx
import React, { useEffect, useState } from "react";
import { Paper, Typography, List, ListItem, ListItemText } from "@mui/material";

const API_BASE = "https://hospital-management-16wx.onrender.com
";

const AmbulanceETA = () => {
  const [etas, setEtas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadETAs = async () => {
    try {
      setError("");
      setLoading(true);

      // 🟢 Backend route (future)
      // const res = await fetch(`${API_BASE}/api/ambulances/eta`);
      // const data = await res.json();
      // setEtas(data);

      // 🔵 Fallback dummy data (safe)
      setEtas([
        { callId: "CASE-101", ambulance: "PB-10-AB-1234", eta: "4 min" },
        { callId: "CASE-102", ambulance: "PB-10-CD-5678", eta: "9 min" },
      ]);
    } catch (err) {
      setError("Failed to load ETA data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadETAs();
    const interval = setInterval(loadETAs, 15000); // auto-refresh every 15 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Live ETA Tracker
      </Typography>

      {loading && <Typography>Loading ETAs...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      <List>
        {etas.map((e, i) => (
          <ListItem key={i} divider>
            <ListItemText
              primary={`${e.callId} — ${e.ambulance}`}
              secondary={`ETA: ${e.eta}`}
            />
          </ListItem>
        ))}

        {!loading && etas.length === 0 && (
          <Typography sx={{ p: 2 }}>No calls in progress.</Typography>
        )}
      </List>
    </Paper>
  );
};

export default AmbulanceETA;
