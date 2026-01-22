import React from "react";
import { Box, Typography, Divider, Grid, Paper } from "@mui/material";
import { motion } from "framer-motion";
import qtcoImg from "../assets/qtco.png";
import banksetaImg from "../assets/bank_seta.png";
import cetaImg from "../assets/Ceta-Logo.png";
import osacImg from "../assets/osac.jpeg";
import servicesetaImg from "../assets/services_seta.jpg";
import mictsetaImg from "../assets/mict.jpeg";
import agrisetaImg from "../assets/agriseta.png";

const orange = "#ff9800";
const black = "#111";
const white = "#fff";

const accreditations = [
  { name: "QTCO", img: qtcoImg },
  { name: "BANK SETA", img: banksetaImg },
  { name: "CETA", img: cetaImg },
  { name: "OSAC", img: osacImg },
  { name: "SERVICES SETA", img: servicesetaImg },
  { name: "MICT SETA", img: mictsetaImg },
  { name: "AGRISETA", img: agrisetaImg },
];

const MotionPaper = motion(Paper);

const ClientsAndAccreditations: React.FC = () => (
  <Box sx={{ bgcolor: white, py: 8 }}>
    <Box sx={{ maxWidth: "1200px", mx: "auto", px: { xs: 2, md: 0 } }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: orange,
          textAlign: "center",
          mb: 1,
        }}
      >
        Accredited By
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ color: black, textAlign: "center", maxWidth: 900, mx: "auto" }}
      >
        Our programmes and services align with industry requirements and quality
        standards.
      </Typography>
      <Divider
        sx={{
          width: 60,
          mx: "auto",
          my: 3,
          borderBottomWidth: 3,
          bgcolor: orange,
        }}
      />
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        {accreditations.map((acc) => (
          <Grid item key={acc.name}>
            <MotionPaper
              elevation={3}
              whileHover={{
                scale: 1.1,
                boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
              }}
              transition={{ duration: 0.3 }}
              sx={{
                height: 70,
                width: 140,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: white,
              }}
            >
              <Box
                component="img"
                src={acc.img}
                alt={acc.name}
                loading="lazy"
                sx={{ height: "100%", width: "100%", objectFit: "contain" }}
              />
            </MotionPaper>
          </Grid>
        ))}
      </Grid>
    </Box>
  </Box>
);

export default ClientsAndAccreditations;
