// src/Pages/Login/Register/Register.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Tab,
  Tabs,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { api } from "../../../utils/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [tab, setTab] = useState(0);          // 0 = patient, 1 = doctor
  const [role, setRole] = useState("patient");
  const [gender, setGender] = useState("female");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleTabChange = (_e, newValue) => {
    setTab(newValue);
    setRole(newValue === 0 ? "patient" : "doctor");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const formData = new FormData(e.target);

    const name = formData.get("name");
    const email = formData.get("email");
    const rawPassword = formData.get("password") || "";
    const rawConfirm = formData.get("confirmPassword") || "";
    const phone = formData.get("phone");
    const address = formData.get("address");

    const password = rawPassword.trim();
  const confirmPassword = rawConfirm.trim();

  console.log("PASSWORD DEBUG =>", `"${password}"`, `"${confirmPassword}"`);

  if (password !== confirmPassword) {
    alert("Passwords do not match ❌");
    // ya setMessage("Passwords do not match ❌");
    return;
  }

    const payload = {
      name,
      email,
      password,
      phone,
      address,
      gender,
      role, // "patient" ya "doctor"
    };

    try {
      const res = await api.post("/api/auth/register", payload);
      console.log("Registered:", res.data);

      // token ko store kar lo (optional but useful)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      setMessage("Registered successfully ✅");

      // thodi der baad login page pe bhejna
      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message || "Registration failed ❌";
      setMessage(msg);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      {/* Tabs: PATIENT / DOCTOR */}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        centered
        sx={{ mb: 3, backgroundColor: "#f5f5f5", borderRadius: 50 }}
      >
        <Tab label="PATIENT" />
        <Tab label="DOCTOR" />
      </Tabs>

      {/* Title */}
      <Typography
        variant="h5"
        align="center"
        sx={{ mb: 3, fontWeight: 600 }}
      >
        {role === "patient" ? "REGISTER AS PATIENT" : "REGISTER AS DOCTOR"}
      </Typography>

      {/* Message */}
      {message && (
        <Typography
          align="center"
          sx={{
            mb: 2,
            color: message.includes("✅") ? "green" : "red",
          }}
        >
          {message}
        </Typography>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
          }}
        >
          {/* First Name */}
          <TextField
            label="First Name"
            name="name"
            required
            fullWidth
          />

          {/* Address */}
          <TextField
            label="Address"
            name="address"
            fullWidth
          />

          {/* Email */}
          <TextField
            label="Your mail"
            name="email"
            type="email"
            required
            fullWidth
          />

          {/* Phone */}
          <TextField
            label="Your phone"
            name="phone"
            fullWidth
          />

          {/* Password */}
          <TextField
            label="Your password"
            name="password"
            type="password"
            required
            fullWidth
          />

          {/* Confirm password */}
          <TextField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            required
            fullWidth
          />
        </Box>

        {/* Gender */}
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography sx={{ mb: 1 }}>Gender</Typography>
          <RadioGroup
            row
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            name="gender"
            sx={{ justifyContent: "center" }}
          >
            <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
        </Box>

        {/* Register button */}
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: "green",
              "&:hover": { backgroundColor: "#006400" },
              px: 6,
            }}
          >
            REGISTER
          </Button>
        </Box>

        {/* Already have an account */}
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography
            sx={{ cursor: "pointer", color: "blue" }}
            onClick={() => navigate("/login")}
          >
            ALREADY HAVE AN ACCOUNT ?
          </Typography>
        </Box>
      </form>
    </Box>
  );
};

export default Register;
