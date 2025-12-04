import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { NavLink } from "react-router-dom";
import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

// ✅ BACKEND SE DATA
const fetchApprovedDoctors = async () => {
  const response = await fetch("https://hospital-management-16wx.onrender.com/api/doctors"); // yaha change
  if (!response.ok) {
    throw new Error("Failed to fetch doctors");
  }
  console.log("fetching data...");
  const data = await response.json();
  return data;
};

export default function PatientViewDoctor() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["approvedDoctors"],
    queryFn: fetchApprovedDoctors,
  });

  if (isLoading) {
    return <span>Loading doctors...</span>;
  }

  if (isError) {
    console.error(error);
    return <span>Failed to load data. Internal server error</span>;
  }

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" sx={{ my: 3 }}>
        Total available doctors: {data?.length || 0}
      </Typography>

      <Table sx={{ minWidth: 650 }} size="small" aria-label="doctors table">
        <TableHead>
          <TableRow>
            <TableCell align="center" style={{ padding: "20px 0" }}>
              Name
            </TableCell>
            <TableCell align="center">Specialist</TableCell>
            <TableCell align="center">Available</TableCell>
            <TableCell align="center">Fee</TableCell>
            <TableCell align="center">Phone</TableCell>
            <TableCell align="center">Gender</TableCell>
            <TableCell align="center">Make Appointment</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((doctorData) => (
            <TableRow
              key={doctorData._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                style={{ borderRight: "1px solid #ccc" }}
              >
                {doctorData.name}
              </TableCell>

              {/* backend field: specialization */}
              <TableCell
                align="center"
                style={{ borderRight: "1px solid #ccc" }}
              >
                {doctorData.specialization || "N/A"}
              </TableCell>

              {/* niche wale fields abhi DB me nahi, isliye N/A */}
              <TableCell align="center">
                {doctorData.time || "N/A"}
              </TableCell>
              <TableCell align="center">
                {doctorData.fee || "N/A"}
              </TableCell>
              <TableCell align="center">
                {doctorData.phone || "N/A"}
              </TableCell>
              <TableCell align="center">
                {doctorData.gender || "N/A"}
              </TableCell>

              <TableCell align="center">
                <NavLink to={`/addPatient/${doctorData.email || ""}`}>
                  <input
                    style={{
                      color: "#fff",
                      padding: "5px 10px",
                      cursor: "pointer",
                      border: "none",
                      borderRadius: "5px",
                      backgroundColor: "#224B0C",
                    }}
                    id="submit"
                    type="submit"
                    name="appointment"
                    value="Appointment"
                  />
                </NavLink>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
