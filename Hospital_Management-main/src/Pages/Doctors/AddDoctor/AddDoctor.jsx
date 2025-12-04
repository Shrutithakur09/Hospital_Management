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
import { NavLink } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import Calender from "../../Shared/Calender/Calender";
import { api } from "../../../utils/api"; // ✅ backend axios instance

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

const AddDoctor = () => {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
  const [date, setDate] = React.useState(new Date().toDateString());
  const [image, setImage] = useState(null); // abhi sirf UI ke liye, backend me nahi ja raha

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      typeof value === "string" ? value.split(",") : value
    );
  };

  // ✅ NEW: backend ko data bhejne wala function
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    // JSON payload banaya backend ke schema ke hisaab se
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      fee: Number(formData.get("fee")) || undefined,
      age: Number(formData.get("age")) || undefined,
      specialization: formData.get("specialist"), // Doctor model me "specialization"
      address: formData.get("address"),
      gender: formData.get("gender"),
      availableTime: formData.get("time"),
      degrees: personName, // multiple degrees
      salary: Number(formData.get("salary")) || undefined,
      joiningDate: date,
      // image: image  // ← agar future me image upload add karein to yahan handle karenge
    };

    try {
      const res = await api.post("/api/doctors", payload);
      console.log("Doctor created:", res.data);
      alert("Doctor added successfully ✅");

      // form reset
      e.target.reset();
      setPersonName([]);
      setImage(null);
    } catch (err) {
      console.error(err);
      alert("Failed to add doctor ❌");
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
            to="/doctors"
            style={{ textDecoration: "none", width: "100%", color: "#fff" }}
          >
            Doctors List
          </NavLink>
        </Button>
      </Box>
      <hr />

      {/* ✅ ab ye form backend pe POST karega */}
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

          {/* Fees */}
          <Grid item xs={12} md={4}>
            <Typography variant="OVERLINE TEXT">Fees</Typography>
          </Grid>
          <Grid item xs={12} md={8} sx={{ marginLeft: { md: "-5rem" } }}>
            <TextField
              label="Set Fees"
              name="fee"
              required
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
              required
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
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                name="degrees"
                multiple
                value={personName}
                onChange={handleChange}
                variant="standard"
                fullWidth
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
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

          {/* Salary */}
          <Grid item xs={12} md={4}>
            <Typography variant="OVERLINE TEXT">Salary</Typography>
          </Grid>
          <Grid item xs={12} md={8} sx={{ marginLeft: { md: "-5rem" } }}>
            <TextField
              label="Enter salary"
              name="salary"
              fullWidth
            />
          </Grid>

          {/* Available time */}
          <Grid item xs={12} md={4}>
            <Typography variant="OVERLINE TEXT">Available Time</Typography>
          </Grid>
          <Grid item xs={12} md={8} sx={{ marginLeft: { md: "-5rem" } }}>
            <TextField
              label="Eg: 8pm-10pm"
              name="time"
              required
              fullWidth
            />
          </Grid>

          {/* Joining date */}
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
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="gender"
              required
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
            </RadioGroup>
          </Grid>

          {/* Image (abhi UI-only) */}
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
                alt="image-upload"
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

export default AddDoctor;
