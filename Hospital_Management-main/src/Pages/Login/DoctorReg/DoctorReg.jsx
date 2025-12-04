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
  Select,
  MenuItem,
  OutlinedInput,
  Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Calender from "../../Shared/Calender/Calender";
import { api } from "../../../utils/api";          // ⭐ NEW
import { useNavigate } from "react-router-dom";    // ⭐ NEW

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const degreeList = ["MBBS", "BCS", "FCPS", "PHD", "BMBS", "MBChC", "MBBCh"];
function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const DoctorReg = () => {
  const theme = useTheme();
  const [personName, setPersonName] = useState([]);
  const [date, setDate] = useState(new Date().toDateString());
  const [image, setImage] = useState(null);        // abhi backend ko nahi bhej rahe
  const navigate = useNavigate();                 // ⭐

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const address = formData.get("address");
    const gender = formData.get("gender");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    // 👉 auth service ke liye payload
    const payload = {
      name,
      email,
      password,
      phone,
      address,
      gender,
      role: "doctor",    // ⭐ IMPORTANT
    };

    try {
      // 1) AUTH / USERS COLLECTION ME DOCTOR CREATE KARO
      const res = await api.post("/api/auth/register", payload);
      console.log("DOCTOR REGISTER RESPONSE:", res.data);

      alert("Doctor registered successfully ✅");
      navigate("/login");

      // 2) Agar tum chaho toh yahan baad me doctor ki
      //    extra details (fees, degrees, image, time, etc.)
      //    ke liye alag endpoint call kar sakti ho.
      //    Abhi ke liye hum sirf auth side handle kar rahe hain.

    } catch (err) {
      console.error("DOCTOR REGISTER ERROR:", err);
      const msg =
        err.response?.data?.message || "Doctor registration failed ❌";
      alert(msg);
    }
  };

  return (
    <Box
      style={{
        border: "2px solid #ccc",
        padding: "1rem 1rem",
        background: "#fff",
        borderRadius: "10px",
      }}
    >
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
              type="email"
              required
              fullWidth
            />
          </Grid>

          {/* Phone */}
          <Grid item xs={12} md={4}>
            <Typography variant="OVERLINE TEXT">Phone</Typography>
          </Grid>
          <Grid item xs={12} md={8} sx={{ marginLeft: { md: "-5rem" } }}>
            <TextField
              label="Enter number"
              name="phone"
              required
              fullWidth
            />
          </Grid>

          {/* Password */}
          <Grid item xs={12} md={4}>
            <Typography variant="OVERLINE TEXT">Password</Typography>
          </Grid>
          <Grid item xs={12} md={8} sx={{ marginLeft: { md: "-5rem" } }}>
            <TextField
              label="Set password"
              name="password"
              type="password"
              required
              fullWidth
            />
          </Grid>

          {/* Confirm Password */}
          <Grid item xs={12} md={4}>
            <Typography variant="OVERLINE TEXT">Confirm Password</Typography>
          </Grid>
          <Grid item xs={12} md={8} sx={{ marginLeft: { md: "-5rem" } }}>
            <TextField
              label="Confirm password"
              name="confirmPassword"
              type="password"
              required
              fullWidth
            />
          </Grid>

          {/* Fees */}
          <Grid item xs={12} md={4}>
            <Typography variant="OVERLINE TEXT">Fees</Typography>
          </Grid>
          <Grid item xs={12} md={8} sx={{ marginLeft: { md: "-5rem" } }}>
            <TextField
              label="Set Fees"
              name="fee"
              fullWidth
            />
          </Grid>

          {/* Age */}
          <Grid item xs={12} md={4}>
            <Typography variant="OVERLINE TEXT">Age</Typography>
          </Grid>
          <Grid item xs={12} md={8} sx={{ marginLeft: { md: "-5rem" } }}>
            <TextField
              label="Set Age"
              name="age"
              fullWidth
            />
          </Grid>

          {/* Specialist */}
          <Grid item xs={12} md={4}>
            <Typography variant="OVERLINE TEXT">Specialist</Typography>
          </Grid>
          <Grid item xs={12} md={8} sx={{ marginLeft: { md: "-5rem" } }}>
            <TextField
              label="Speciality"
              name="specialist"
              fullWidth
            />
          </Grid>

          {/* Address */}
          <Grid item xs={12} md={4}>
            <Typography variant="OVERLINE TEXT">Address</Typography>
          </Grid>
          <Grid item xs={12} md={8} sx={{ marginLeft: { md: "-5rem" } }}>
            <TextField
              label="Enter Address"
              variant="standard"
              name="address"
              multiline
              rows={5}
              fullWidth
            />
          </Grid>

          {/* Degrees */}
          <Grid item xs={12} md={4}>
            <Typography variant="OVERLINE TEXT">Choose Degrees</Typography>
          </Grid>
          <Grid item xs={12} md={8} sx={{ marginLeft: { md: "-5rem" } }}>
            <Box>
              <Select
                multiple
                value={personName}
                onChange={handleChange}
                variant="standard"
                fullWidth
                input={<OutlinedInput id="select-multiple-chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                <MenuItem disabled value="">
                  <em>You Can Choose Multiple Degrees </em>
                </MenuItem>
                {degreeList.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, personName, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Grid>

          {/* Available Time */}
          <Grid item xs={12} md={4}>
            <Typography variant="OVERLINE TEXT">Available Time</Typography>
          </Grid>
          <Grid item xs={12} md={8} sx={{ marginLeft: { md: "-5rem" } }}>
            <TextField
              label="Eg: 8pm-10pm"
              name="time"
              fullWidth
            />
          </Grid>

          {/* Date Of Joining */}
          <Grid item xs={12} md={4}>
            <Typography variant="OVERLINE TEXT">Date Of Joining</Typography>
          </Grid>
          <Grid item xs={12} md={8} sx={{ marginLeft: { md: "-6.5rem" } }}>
            <Calender value={date} setValue={setDate} />
          </Grid>

          {/* Gender */}
          <Grid item xs={12} md={4}>
            <Typography variant="OVERLINE TEXT">Gender</Typography>
          </Grid>
          <Grid item xs={12} md={8} sx={{ marginLeft: { md: "-5rem" } }}>
            <RadioGroup row name="gender" required>
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
            </RadioGroup>
          </Grid>

          {/* Add Image (UI only for now) */}
          <Grid item xs={12} md={4}>
            <Typography variant="OVERLINE TEXT">Add Image</Typography>
          </Grid>
          <Grid item xs={12} md={8} sx={{ marginLeft: { md: "-5rem" } }}>
            <Fab color="primary" aria-label="add">
              <input
                accept="image/*"
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                name="image"
                style={{
                  opacity: 0,
                  cursor: "pointer",
                  zIndex: 1,
                  height: "55px",
                }}
              />
              <AddIcon
                style={{
                  position: "absolute",
                  top: 15,
                  left: 17,
                }}
              />
            </Fab>
          </Grid>

          {/* Decision */}
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

export default DoctorReg;
