// src/Pages/Login/Login.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Card,
  Container,
} from "@mui/material";
import { api } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient"); // optional: patient/doctor select
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.post("/api/auth/login", { email, password });

      console.log("LOGIN SUCCESS:", res.data);

      // token & user store
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("userEmail", res.data.user.email);
      localStorage.setItem("userName", res.data.user.name);

      setMessage("Login successful ✅");

      // role ke hisaab se redirect (jo chahe change kar sakti ho)
      if (res.data.user.role === "doctor") {
        navigate("/doctors");
      } else {
        navigate("/"); // patient ko overview / home
      }
    } catch (err) {
      console.error("LOGIN FRONTEND ERROR:", err);
      const msg =
        err.response?.data?.message || "Login failed ❌";
      setMessage(msg);
    }
  };

  return (
    <Card
      sx={{
        boxShadow: "none",
        height: "100%",
      }}
    >
      <Container fixed>
        <Box sx={{ mt: 6 }}>
          <Typography
            variant="h5"
            align="center"
            sx={{ mb: 3, fontWeight: 600 }}
          >
            LOGIN
          </Typography>

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

          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
              }}
            >
              <TextField
                label="Your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
            </Box>

            {/* optional: just for UI, backend role se decide karega */}
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography sx={{ mb: 1 }}>Login as</Typography>
              <RadioGroup
                row
                value={role}
                onChange={(e) => setRole(e.target.value)}
                sx={{ justifyContent: "center" }}
              >
                <FormControlLabel value="patient" control={<Radio />} label="Patient" />
                <FormControlLabel value="doctor" control={<Radio />} label="Doctor" />
              </RadioGroup>
            </Box>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography
                sx={{ cursor: "pointer", color: "blue" }}
                onClick={() => navigate("/register")}
              >
              Don't have an account? Register
              </Typography>
            </Box>

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
                LOGIN
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </Card>
  );
};

export default Login;
