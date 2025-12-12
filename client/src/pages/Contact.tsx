import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import Navbar from "../components/Navbar";
import axios from "axios";
import API_BASE from "../apiConfig";

const orange = "#ff8800";
const black = "#111";

const Contact: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await axios.post(`${API_BASE}/api/enquiries/`, {
        full_name: fullName,
        email,
        phone,
        message,
      });
      setSubmitSuccess(true);
      setFullName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      console.error("Error submitting enquiry", err);
      setSubmitError("Could not send your message. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          bgcolor: "linear-gradient(135deg, #fff7e6 0%, #ffe0b3 40%, #ffffff 100%)",
          display: "flex",
          justifyContent: "center",
          overflowX: "hidden",
          py: 6,
          px: { xs: 2, md: 4 },
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", sm: "95%", md: 900, lg: 1100 },
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            boxShadow:
              "0 10px 25px rgba(0,0,0,0.12), 0 4px 10px rgba(0,0,0,0.08)",
            border: "1px solid rgba(0,0,0,0.05)",
            bgcolor: "#ffffff",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: orange,
              textAlign: "center",
              mb: { xs: 2, md: 3 },
              fontSize: { xs: "1.6rem", md: "2.125rem" },
            }}
          >
            Contact Us
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              textAlign: "center",
              mb: { xs: 3, md: 4 },
              color: "text.secondary",
            }}
          >
            We would love to hear from you. Reach out for learnerships, training
            or business partnerships.
          </Typography>

          <Grid
            container
            spacing={4}
            alignItems="flex-start"
          >
            <Grid item xs={12} md={5}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: black,
                  mb: 1,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Get in touch
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: black,
                  mb: 2,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Have questions about our learnerships, corporate training, or
                consulting services? Send us a message and we will respond as
                soon as possible.
              </Typography>
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <EmailIcon sx={{ color: orange }} />
                  <Typography
                    variant="body2"
                    sx={{ color: black, wordBreak: "break-word" }}
                  >
                    info@enerhu.co.za
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PhoneIcon sx={{ color: orange }} />
                  <Typography variant="body2" sx={{ color: black }}>
                    +27 00 000 0000
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  <PlaceIcon sx={{ color: orange, mt: 0.3 }} />
                  <Typography
                    variant="body2"
                    sx={{ color: black, maxWidth: 260 }}
                  >
                    Stand 298, Mphambo Village, R81 Main Road, Malamulele, 0982
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={7}>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                  bgcolor: "#fff",
                  p: { xs: 2, md: 3 },
                  borderRadius: 2,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                }}
              >
                {submitSuccess && (
                  <Typography color="success.main">
                    Message sent successfully.
                  </Typography>
                )}
                {submitError && <Typography color="error">{submitError}</Typography>}

                <TextField
                  label="Full Name"
                  fullWidth
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label="Phone"
                  fullWidth
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <TextField
                  label="Message"
                  fullWidth
                  required
                  multiline
                  minRows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Box sx={{ textAlign: "right", mt: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                    sx={{
                      bgcolor: orange,
                      px: 4,
                      py: 1,
                      borderRadius: 999,
                      boxShadow: "0 6px 12px rgba(0,0,0,0.18)",
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": { bgcolor: "#e67600" },
                    }}
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  );
};

export default Contact;

