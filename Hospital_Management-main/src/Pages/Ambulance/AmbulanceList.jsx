// src/Pages/Ambulance/AmbulanceList.jsx
import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Typography
} from "@mui/material";
import { api } from "../../utils/api";

const AmbulanceList = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // api.get("/api/ambulance")
    //   .then(res => setRows(res.data))
    //   .catch(console.error);

    // TEMP dummy data:
    setRows([
      { id: 1, plate: "PB-10-AB-1234", status: "available", driver: "Rohit", eta: "—" },
      { id: 2, plate: "PB-10-CD-5678", status: "on-trip", driver: "Neha", eta: "06 min" },
    ]);
  }, []);

  const colorForStatus = (s) =>
    s === "available" ? "success" : s === "on-trip" ? "warning" : "default";

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" sx={{ m: 2 }}>
        Available Ambulances
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Vehicle Number</TableCell>
            <TableCell>Driver</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>ETA</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.id}</TableCell>
              <TableCell>{r.plate}</TableCell>
              <TableCell>{r.driver}</TableCell>
              <TableCell>
                <Chip label={r.status} color={colorForStatus(r.status)} size="small" />
              </TableCell>
              <TableCell>{r.eta}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AmbulanceList;
