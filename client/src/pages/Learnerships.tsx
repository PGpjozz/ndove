import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, Chip, Button } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API_BASE from "../apiConfig";

const orange = "#ff8800";

const Learnerships: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${API_BASE}/api/opportunities/`);
        const filtered = res.data.filter((o: any) => o.type === "learnership");
        setItems(filtered);
      } catch (err) {
        console.error("Error loading learnerships", err);
        setError("Could not load learnerships. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          bgcolor:
            "linear-gradient(135deg, #fff7e6 0%, #ffe0b3 40%, #ffffff 100%)",
          display: "flex",
          justifyContent: "center",
          overflowX: "hidden",
          boxSizing: "border-box",
          py: 6,
          px: { xs: 2, md: 4 },
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: { xs: "100%", sm: "95%", md: "900px", lg: "1100px" },
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
            }}
          >
            Available Learnerships
          </Typography>

          {loading && <Typography>Loading learnerships...</Typography>}
          {error && (
            <Typography color="error" mb={2}>
              {error}
            </Typography>
          )}
          {!loading && !error && items.length === 0 && (
            <Typography>No learnerships are currently available.</Typography>
          )}

          {!loading && !error && items.length > 0 && (
            <Grid container spacing={3}>
              {items.map((item) => (
                <Grid item xs={12} key={item.id}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      bgcolor: "#fff",
                      borderColor: "rgba(0,0,0,0.04)",
                      boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {item.title}
                      </Typography>
                      <Chip
                        label="Learnership"
                        color="primary"
                        sx={{ bgcolor: orange, color: "white" }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1.5 }}>
                      {item.description}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 1 }}
                    >
                      Start: {item.start_date} | End: {item.end_date}
                    </Typography>
                    <Button
                      component={Link}
                      to={`/enroll?type=learnership&title=${encodeURIComponent(
                        item.title
                      )}`}
                      variant="contained"
                      size="small"
                      sx={{
                        bgcolor: orange,
                        px: 3,
                        borderRadius: 999,
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": { bgcolor: "#e67600" },
                      }}
                    >
                      Apply
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default Learnerships;
