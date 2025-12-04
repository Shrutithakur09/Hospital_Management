import React, { useState } from "react"; 
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Button, Card, TextField, Typography } from "@mui/material";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Gender from "../../Shared/Gender/Gender";
import { api } from "../../../utils/api";   // 👈 path adjust ho sakta hai: ../ ka count check kar lena

const PatientReg = () => {
  const [loginData, setLoginData] = useState({});
  const navigate = useNavigate()

  const handleOnChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const newLoginData = { ...loginData };
    newLoginData[field] = value;
    setLoginData(newLoginData);
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    // password match check
    if (loginData.password !== loginData.password2) {
      alert("Passwords do not match ❌");
      return;
    }

    try {
      const payload = {
        name: loginData.name,
        email: loginData.email,
        password: loginData.password,
        phone: loginData.phone,
        address: loginData.address,
        gender: loginData.gender || "female",  // Gender component se agar na aaye to default
        role: "patient",
      };

      const res = await api.post("/api/auth/register", payload);
      console.log("REGISTER RESPONSE:", res.data);

      // token save karna ho to:
      // localStorage.setItem("token", res.data.token);
      // localStorage.setItem("role", res.data.user.role);

      alert("Registered successfully ✅");
      navigate("/login");
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      const msg =
        err.response?.data?.message || "Registration failed ❌";
      alert(msg);
    }
  };

  return (
    <div>
      <Container fixed>
        <Typography variant="h5" gutterBottom component="div">
          REGISTER AS PATIENT
        </Typography>
        <Box>
          <form className="text-center" onSubmit={handleSignUpSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} sm={12}>
                <TextField
                  sx={{ width: "70%", m: 1 }}
                  label="First Name"
                  name="name"
                  onChange={handleOnChange}
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  sx={{ width: "70%", m: 1 }}
                  label="Address"
                  name="address"           // 👈 pehle 'text' tha, use 'address' kar diya
                  onChange={handleOnChange}
                  variant="standard"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6} sm={12}>
                <TextField
                  sx={{ width: "70%", m: 1 }}
                  label="Your mail"
                  name="email"
                  onChange={handleOnChange}
                  variant="standard"
                  type="email"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  sx={{ width: "70%", m: 1 }}
                  label="Your phone"
                  name="phone"             // 👈 pehle 'email' tha, ab 'phone'
                  onChange={handleOnChange}
                  variant="standard"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6} sm={12}>
                <TextField
                  sx={{ width: "70%", m: 1 }}
                  label="Your password"
                  name="password"
                  onChange={handleOnChange}
                  variant="standard"
                  type="password"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  sx={{ width: "70%", m: 1 }}
                  label="Confirm password"
                  name="password2"
                  onChange={handleOnChange}
                  variant="standard"
                  type="password"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6} sm={12}>
                <Gender />   {/* agar Gender kisi input ka name="gender" set karta hai to theek hai */}
              </Grid>
              <Grid item xs={12} md={6}></Grid>
            </Grid>

            <Button
              sx={{ width: "30%", m: 3 }}
              variant="contained"
              type="submit"
              style={{
                backgroundColor: "green",
                color: "#fff",
              }}
            >
              Register
            </Button>
          </form>
        </Box>

        <NavLink
          to="/login"
          style={{
            textDecoration: "none",
          }}
        >
          <Button sx={{ width: "100%", m: 1 }} color="inherit">
            Already have an account ?
          </Button>
        </NavLink>
      </Container>
    </div>
  );
};

export default PatientReg;
