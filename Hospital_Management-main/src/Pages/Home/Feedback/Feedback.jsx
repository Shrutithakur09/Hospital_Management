import React, { useRef } from "react";
import {
  Button,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import { api } from "../../../utils/api";

const Feedback = () => {
  const form = useRef();

  // ====== SNACKBAR STATE ======
  const [snackPack, setSnackPack] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState(undefined);

  React.useEffect(() => {
    if (snackPack.length && !messageInfo) {
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const pushSnack = (message) => {
    setSnackPack((prev) => [
      ...prev,
      { message, key: new Date().getTime() },
    ]);
  };

  const handleClose = (_event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  // ====== SUBMIT HANDLER ======
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData(form.current);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      subject: fd.get("subject"),
      message: fd.get("message"),
    };

    // basic validation
    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      pushSnack("Please fill all fields ❌");
      return;
    }

    try {
      const res = await api.post("/api/feedback", payload);
      console.log("FEEDBACK RES:", res.data);

      pushSnack("Feedback sent & saved ✅");
      form.current.reset();
    } catch (err) {
      console.error("FEEDBACK ERROR:", err);
      const msg =
        err.response?.data?.message || "Failed to send feedback ❌";
      pushSnack(msg);
    }
  };

  return (
    <Box
      sx={{
        background: "#fff",
        padding: "1rem 0.1rem",
        borderRadius: "0.5rem",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h5" sx={{ fontFamily: "monospace" }}>
        Feedback
      </Typography>

      <form onSubmit={handleSubmit} ref={form}>
        <TextField
          autoComplete="off"
          label="Your Name Here"
          name="name"
          sx={{ width: "90%", mt: 3 }}
        />
        <TextField
          autoComplete="off"
          label="Your Email Here"
          name="email"
          sx={{ width: "90%", mt: 3 }}
        />
        <TextField
          autoComplete="off"
          label="Subject Here"
          name="subject"
          sx={{ width: "90%", mt: 3 }}
        />
        <TextField
          autoComplete="off"
          label="Write Your Suggestion Here"
          multiline
          rows={8}
          name="message"
          sx={{ width: "90%", mt: 4 }}
        />

        <Box sx={{ py: 2 }}>
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            sx={{ width: "90%" }}
          >
            Send Message
          </Button>

          <Snackbar
            key={messageInfo ? messageInfo.key : undefined}
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            TransitionProps={{ onExited: handleExited }}
            message={messageInfo ? messageInfo.message : undefined}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                sx={{ p: 0.5 }}
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
            }
          />
        </Box>
      </form>
    </Box>
  );
};

export default Feedback;
