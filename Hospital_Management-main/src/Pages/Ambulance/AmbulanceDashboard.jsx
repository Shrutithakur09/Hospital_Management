// src/Pages/Ambulance/AmbulanceDashboard.jsx
import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const API_BASE = "https://hospital-management-16wx.onrender.com
";

const AmbulanceDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSummary = async () => {
    try {
      setLoading(true);

      // 🟢 Backend route (future)
      // const res = await fetch(`${API_BASE}/api/ambulances/summary`);
      // const data = await res.json();
      // setSummary(data);

      // 🔵 Dummy fallback (safe)
      setSummary({
        total: 120,
        available: 19,
        onTrip: 6,
        avgEta: "08 min",
      });
    } catch (err) {
      console.error("Failed to load summary:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
    const interval = setInterval(loadSummary, 30000);
    return () => clearInterval(interval);
  }, []);

  const s = summary || {};

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Ambulance Overview
        </Typography>
      </Grid>

      {loading && (
        <Grid item xs={12}>
          <Typography>Loading dashboard...</Typography>
        </Grid>
      )}

      {!loading && (
        <>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2">Total Ambulances</Typography>
                <Typography variant="h4">{s.total ?? 0}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2">Available</Typography>
                <Typography variant="h4">{s.available ?? 0}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2">On Trip</Typography>
                <Typography variant="h4">{s.onTrip ?? 0}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2">Average ETA</Typography>
                <Typography variant="h4">{s.avgEta ?? "0 min"}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default AmbulanceDashboard;
