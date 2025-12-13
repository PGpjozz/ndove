import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { motion } from "framer-motion";
import generalManagerImg from "../assets/general_manager.jpg";

const orange = "#ff9800";
const black = "#111";
const white = "#fff";

const team = [
  {
    name: "Vanessa",
    role: "General Manager",
    img: generalManagerImg,
    hex: "#e6e6e6",
  },
  {
    name: "Eddie",
    role: "Learning Programme Manager",
    img: generalManagerImg,
    hex: orange,
  },
  {
    name: "Ikanyeng",
    role: "Project Coordinator",
    img: generalManagerImg,
    hex: "#e6e6e6",
  },
  {
    name: "Kamogelo",
    role: "HR Officer",
    img: generalManagerImg,
    hex: "#e6e6e6",
  },
  {
    name: "Orie",
    role: "Project Coordinator",
    img: generalManagerImg,
    hex: orange,
  },
];

const MotionPaper = motion(Paper);

const Team: React.FC = () => (
  <Box sx={{ bgcolor: "#fafafa", py: { xs: 6, md: 8 } }}>
    <Box sx={{ maxWidth: "1200px", mx: "auto", px: { xs: 2, md: 3 } }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: black, textAlign: "center", mb: 6 }}
      >
        Meet the Team
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {team.map((member) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={member.name}>
            <MotionPaper
              elevation={3}
              whileHover={{ y: -8, boxShadow: "0 12px 24px rgba(0,0,0,0.2)" }}
              transition={{ duration: 0.3 }}
              sx={{
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: { xs: 2.5, sm: 3 },
                px: 2,
                cursor: "pointer",
                backgroundColor: member.hex,
                overflow: "hidden",
              }}
            >
              <motion.img
                src={member.img}
                alt={member.name}
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: 12,
                }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: member.hex === orange ? white : orange,
                  fontWeight: 700,
                  textAlign: "center",
                  mb: 0.5,
                }}
              >
                {member.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: member.hex === orange ? "rgba(255,255,255,0.9)" : black,
                  textAlign: "center",
                  fontWeight: 400,
                }}
              >
                {member.role}
              </Typography>
            </MotionPaper>
          </Grid>
        ))}
      </Grid>
    </Box>
  </Box>
);

export default Team;
