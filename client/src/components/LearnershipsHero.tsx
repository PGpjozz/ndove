import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";

const bgImage =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";

const orange = "#ff9800";
const black = "#111";
const white = "#fff";

const MotionBox = motion(Box);

const LearnershipsHero: React.FC = () => (
  <Box
    sx={{
      width: "100%",
      minHeight: { xs: 380, md: 480 },
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Background Image with subtle zoom */}
    <MotionBox
      sx={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: 0,
      }}
      animate={{ scale: 1.05 }}
      transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
    />

    {/* Orange Overlay */}
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        bgcolor: "rgba(255,152,0,0.85)",
        zIndex: 1,
      }}
    />

    {/* Content */}
    <Box
      sx={{
        position: "relative",
        zIndex: 2,
        width: "100%",
        maxWidth: 900,
        mx: "auto",
        textAlign: "center",
        color: white,
        px: 2,
      }}
    >
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 400, color: white, letterSpacing: 0.5 }}
        >
          Embracing upskilling education
        </Typography>
      </MotionBox>

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            mb: 2,
            fontSize: { xs: "2rem", md: "3rem" },
            lineHeight: 1.2,
          }}
        >
          Learnerships that go a long way
        </Typography>
      </MotionBox>

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            fontWeight: 400,
            fontSize: { xs: "1rem", md: "1.25rem" },
            lineHeight: 1.6,
          }}
        >
          Training can be viewed as a process comprised of five related stages
          or activities: assessment, motivation, design, delivery, and
          evaluation.
        </Typography>
      </MotionBox>

      <MotionBox whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
        <Button
          variant="contained"
          sx={{
            background: white,
            color: black,
            fontWeight: 700,
            px: 4,
            py: 1.5,
            borderRadius: 2,
            fontSize: "1.1rem",
            boxShadow: 3,
            transition: "all 0.3s ease",
            "&:hover": {
              background: orange,
              color: white,
              boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
            },
          }}
        >
          LEARN MORE
        </Button>
      </MotionBox>
    </Box>
  </Box>
);

export default LearnershipsHero;
