import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  InputBase,
  IconButton,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { FaUserTie, FaGraduationCap, FaUsers } from "react-icons/fa6";

const heroImage =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";

const cardData = [
  {
    title: "Consulting Services",
    desc: "Expert advice and solutions tailored to your business needs.",
    icon: <FaUserTie size={40} color="#fff" />,
  },
  {
    title: "Learnerships",
    desc: "Empowering individuals through structured learning programs.",
    icon: <FaGraduationCap size={40} color="#fff" />,
  },
  {
    title: "Human Resource Solutions",
    desc: "Comprehensive HR services for organizational growth.",
    icon: <FaUsers size={40} color="#fff" />,
  },
];

const orange = "#ff9800";
const black = "#111";
const white = "#fff";

const Hero: React.FC = () => (
  <Box sx={{ position: "relative", width: "100%", bgcolor: white }}>
    {/* Hero Image */}
    <Box
      sx={{
        width: "100%",
        height: { xs: 260, md: 340 },
        backgroundImage: `url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: 0,
        position: "relative",
      }}
    >
      {/* Overlay text */}
      <Box
        sx={{
          position: "absolute",
          top: 24,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: white,
            fontWeight: 500,
            textShadow: "0 2px 8px rgba(0,0,0,0.7)",
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          Taking the lead, shaping the future
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          top: { xs: 90, md: 120 },
          display: "flex",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        <Paper
          component="form"
          sx={{
            p: "2px 8px",
            display: "flex",
            alignItems: "center",
            width: { xs: "90%", md: 500 },
            borderRadius: 2,
            boxShadow: 3,
            bgcolor: white,
            border: `2px solid ${orange}`,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1, color: black }}
            placeholder="Search..."
            inputProps={{ "aria-label": "search" }}
          />
          <IconButton
            type="submit"
            sx={{ p: "10px", color: orange }}
            aria-label="search"
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>
    </Box>

    {/* Overlapping Cards */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flexWrap: { xs: "wrap", md: "nowrap" },
        gap: 3,
        width: { xs: "95%", md: "80%" },
        mx: "auto",
        position: "relative",
        mt: { xs: -10, md: -8 },
        zIndex: 3,
        pb: { xs: 6, md: 10 },
      }}
    >
      {cardData.map((card) => (
        <Card
          key={card.title}
          sx={{
            flex: { xs: "1 1 100%", md: "1 1 0" },
            minWidth: { md: 0 },
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            borderRadius: 3,
            background: orange,
            minHeight: 180,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: white,
            px: 2,
            transition: "transform 0.3s, box-shadow 0.3s",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 12px 25px rgba(0,0,0,0.25)",
            },
          }}
        >
          <Box sx={{ mb: 2 }}>{card.icon}</Box>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: white }}>
              {card.title}
            </Typography>
            <Typography variant="body2" sx={{ color: white, mt: 1 }}>
              {card.desc}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  </Box>
);

export default Hero;
