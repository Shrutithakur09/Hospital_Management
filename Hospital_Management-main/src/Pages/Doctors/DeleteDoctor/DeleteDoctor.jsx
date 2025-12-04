import React from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../utils/api"; // Pages/Doctors/DeleteDoctor -> ../../../utils/api

// saare doctors laane wala function
const fetchDoctors = async () => {
  const res = await api.get("/api/doctors");
  return res.data;
};

// ek doctor delete karne wala function
const deleteDoctorById = async (id) => {
  await api.delete(`/api/doctors/${id}`);
};

const DeleteDoctor = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
  });

  const { mutate: deleteDoctor, isLoading: deleting } = useMutation({
    mutationFn: deleteDoctorById,
    onSuccess: () => {
      // list dobara fetch karo
      queryClient.invalidateQueries(["doctors"]);
    },
  });

  if (isLoading) return <p>Loading doctors...</p>;
  if (isError) {
    console.error(error);
    return <p>Failed to load doctors</p>;
  }

  return (
    <Box
      sx={{
        border: "2px solid #ccc",
        padding: "1rem 1rem",
        background: "#fff",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Delete Doctor
      </Typography>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Specialist</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Phone</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((doc) => (
              <TableRow key={doc._id}>
                <TableCell align="center">{doc.name}</TableCell>
                <TableCell align="center">
                  {doc.specialization || "N/A"}
                </TableCell>
                <TableCell align="center">{doc.email || "N/A"}</TableCell>
                <TableCell align="center">{doc.phone || "N/A"}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    color="error"
                    disabled={deleting}
                    onClick={() => {
                      if (
                        window.confirm(
                          `Delete doctor "${doc.name}" permanently?`
                        )
                      ) {
                        deleteDoctor(doc._id);
                      }
                    }}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No doctors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DeleteDoctor;
