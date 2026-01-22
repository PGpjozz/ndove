import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import learnerImg from "../assets/learner1.jpg";

const learners = [
  { name: "Lyrique Carlo", img: learnerImg },
  { name: "Nombulelo Pakathi", img: learnerImg },
  { name: "SUPPLY CHAIN MANAGEMENT", img: learnerImg },
];

const orange = "#ff9800";
const black = "#111";
const white = "#fff";

const MotionBox = motion(Box);

const Learners: React.FC = () => (
  <Box sx={{ bgcolor: white, py: { xs: 6, md: 8 } }}>
    <Box sx={{ maxWidth: "1100px", mx: "auto", px: { xs: 2, md: 0 } }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: orange, mb: 1, textAlign: "center" }}
      >
        Our Learners
      </Typography>
      <Typography
        variant="h6"
        sx={{ color: black, mb: 6, fontWeight: 400, textAlign: "center" }}
      >
        Watch the success stories of our learners and their journey with us.
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {learners.map((learner) => (
          <Grid item xs={12} sm={6} md={4} key={learner.name}>
            <MotionBox
              whileHover={{ scale: 1.05, y: -3 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4 }}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                cursor: "pointer",
                bgcolor: white,
                maxWidth: 220,
                mx: "auto",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  aspectRatio: "4/3",
                  overflow: "hidden",
                  borderRadius: 2,
                  position: "relative",
                }}
              >
                <img
                  src={learner.img}
                  alt={learner.name}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.4s ease",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3))",
                  }}
                />
              </Box>
              <Box sx={{ py: 1.5, textAlign: "center" }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: black, fontWeight: 600 }}
                >
                  {learner.name}
                </Typography>
              </Box>
            </MotionBox>
          </Grid>
        ))}
      </Grid>
    </Box>
  </Box>
);

export default Learners;
