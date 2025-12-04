// src/Pages/Patients/AddPatients/AddPatient.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { NavLink, useParams } from "react-router-dom";
import { api } from "../../../utils/api"; // Pages/Patients/AddPatients -> ../../../utils/api

const AddPatient = () => {
  const { email: doctorEmail } = useParams(); // /addPatient/:email se aaye to milega (agar use karna ho)
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const formData = new FormData(e.target);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      age: Number(formData.get("age")) || undefined,
      disease: formData.get("disease"),
      address: formData.get("address"),
      gender: formData.get("gender"),
      // doctorEmail: doctorEmail || undefined,  // agar patient ko kisi specific doctor se link karna ho to future me
    };

    try {
      const res = await api.post("/api/patients", payload);
      console.log("Patient created:", res.data);
      setMessage("Patient added successfully ✅");
      e.target.reset();
    } catch (err) {
      console.error(err);
      setMessage("Failed to add patient ❌");
    }
  };

  return (
    <Box
      style={{
        border: "2px solid #ccc",
        padding: "1rem 1rem",
        background: "#fff",
      }}
    >
      <Box style={{ display: "flex" }}>
        <Button variant="contained">
          <NavLink
            to="/patients"
            style={{ textDecoration: "none", width: "100%", color: "#fff" }}
          >
            Patients List
          </NavLink>
        </Button>
      </Box>
      <hr />

      <form onSubmit={handleSubmit}>
        <Grid
          container
          spacing={2}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: ".5rem 2rem",
            textAlign: "start",
          }}
        >
          {message && (
            <Grid item xs={12}>
              <Typography
                variant="body1"
                sx={{ mb: 1 }}
                color={message.includes("Failed") ? "error" : "success.main"}
              >
                {message}
              </Typography>
            </Grid>
          )}

          {/* Name */}
          <Grid item xs={12} md={4}>
            <Typography variant="OVERLINE TEXT">Name</Typography>
          </Grid>
          <Grid item xs={12} md={8} sx={{ marginLeft: { md: "-5rem" } }}>
            <TextField
              label="Enter name"
              name="name"
              required
              fullWidth
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} md={4}>
            <Typography variant="OVERLINE TEXT">Email</Typography>
          </Grid>
          <Grid item xs={12} md={8} sx={{ marginLeft: { md: "-5rem" } }}>
            <TextField
              label="Enter email"
              name="email"
              fullWidth
            />
          </Grid>

          {/* Phone */}
          <Grid item xs={12} md={4}>
            <Typography variant="OVERLINE TEXT">Phone</Typography>
          </Grid>
          <Grid item xs={12} md={8} sx={{ marginLeft: { md: "-5rem" } }}>
            <TextField
              label="Enter phone"
              name="phone"
              fullWidth
            />
          </Grid>

          {/* Age */}
          <Grid item xs={12} md={4}>
            <Typography variant="OVERLINE TEXT">Age</Typography>
          </Grid>
          <Grid item xs={12} md={8} sx={{ marginLeft: { md: "-5rem" } }}>
            <TextField
              label="Enter age"
              name="age"
              fullWidth
            />
          </Grid>

          {/* Disease */}
          <Grid item xs={12} md={4}>
            <Typography variant="OVERLINE TEXT">Disease</Typography>
          </Grid>
          <Grid item xs={12} md={8} sx={{ marginLeft: { md: "-5rem" } }}>
            <TextField
              label="Enter disease / problem"
              name="disease"
              required
              fullWidth
            />
          </Grid>

          {/* Address */}
          <Grid item xs={12} md={4}>
            <Typography variant="OVERLINE TEXT">Address</Typography>
          </Grid>
          <Grid item xs={12} md={8} sx={{ marginLeft: { md: "-5rem" } }}>
            <TextField
              label="Enter address"
              name="address"
              multiline
              rows={3}
              fullWidth
            />
          </Grid>

          {/* Gender */}
          <Grid item xs={12} md={4}>
            <Typography variant="OVERLINE TEXT">Gender</Typography>
          </Grid>
          <Grid item xs={12} md={8} sx={{ marginLeft: { md: "-5rem" } }}>
            <RadioGroup
              row
              name="gender"
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
            </RadioGroup>
          </Grid>

          {/* Buttons */}
          <Grid item xs={12} md={4}>
            <Typography variant="OVERLINE TEXT">Decision</Typography>
          </Grid>
          <Grid item xs={12} md={8} sx={{ marginLeft: { md: "-5rem" } }}>
            <Box sx={{ display: "flex", margin: "1rem 0" }}>
              <Button variant="outlined" color="error" type="reset">
                RESET
              </Button>
              <Chip
                label="OR"
                color="secondary"
                style={{
                  marginLeft: "-.8rem",
                  marginRight: "-.8rem",
                  marginTop: ".1rem",
                }}
              />
              <Button variant="outlined" color="success" type="submit">
                SAVE
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddPatient;
