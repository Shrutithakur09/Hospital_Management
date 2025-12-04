// src/Pages/Patients/Patients/Patients.jsx
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../utils/api"; // src → Pages → Patients → Patients → ../../../utils

const fetchPatients = async () => {
  const response = await api.get("/api/patients"); // backend route
  if (!response.ok && response.status) {
    // axios me response.ok nahi hota, ye line sirf safety ke liye hai
  }
  return response.data;
};

export default function Patients() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["patients"],
    queryFn: fetchPatients,
  });

  if (isLoading) return <span>Loading patients...</span>;

  if (isError) {
    console.error(error);
    return <span>Failed to load patients</span>;
  }

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" sx={{ my: 3 }}>
        Total patients: {data?.length || 0}
      </Typography>

      <Table sx={{ minWidth: 650 }} size="small" aria-label="patients table">
        <TableHead>
          <TableRow>
            <TableCell align="center" style={{ padding: "20px 0" }}>
              Name
            </TableCell>
            <TableCell align="center">Age</TableCell>
            <TableCell align="center">Disease</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((p, index) => (
            <TableRow
              key={p._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                style={{ borderRight: "1px solid #ccc" }}
              >
                {p.name}
              </TableCell>
              <TableCell align="center" style={{ borderRight: "1px solid #ccc" }}>
                {p.age ?? "N/A"}
              </TableCell>
              <TableCell align="center">{p.disease || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
