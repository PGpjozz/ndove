import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import enerhuSite from "../assets/enerhu_site.jpg";
import API_BASE from "../apiConfig";
import { Link as RouterLink } from "react-router-dom";

const aboutText = `Enerhu Business Enterprise (Pty) Ltd was established in 2015 as a 100% youth black owned enterprise. We promote and encourage previously disadvantaged communities, especially in rural areas, to participate in economic activities in South Africa through Human Capital Development, consulting services, and accredited Training and Development programmes.`;

const orange = "#ff9800";
const black = "#111";
const white = "#fff";

const About: React.FC = () => {
  const [companyProfileUrl, setCompanyProfileUrl] = useState<string | null>(
    null
  );

  const resolveFileUrl = (path?: string | null) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${base}${p}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/company-profile/`);
        setCompanyProfileUrl(resolveFileUrl(res.data?.pdf) || null);
      } catch (err) {
        // If not uploaded yet (404), we just hide the download button
        setCompanyProfileUrl(null);
      }
    };

    fetchProfile();
  }, []);

  return (
  <Box sx={{ bgcolor: white, pb: 6 }}>
    {/* Thin orange banner with icon and text */}
    <Box
      sx={{
        bgcolor: orange,
        height: 44,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mb: 5,
      }}
    >
      <DownloadIcon sx={{ color: white, mr: 1 }} />
      {companyProfileUrl ? (
        <Button
          component="a"
          href={companyProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: white,
            fontWeight: 600,
            textTransform: "none",
            px: 0,
            "&:hover": { background: "transparent", textDecoration: "underline" },
          }}
        >
          Download our company profile
        </Button>
      ) : (
        <Typography variant="subtitle1" sx={{ color: white, fontWeight: 500 }}>
          Company profile coming soon
        </Typography>
      )}
    </Box>
    {/* About Content */}
    <Box
      sx={{
        maxWidth: "1100px",
        mx: "auto",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        gap: 4,
        px: { xs: 2, sm: 0 },
      }}
    >
      {/* Text: left on sm+ screens, below image on mobile */}
      <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 60%" }, order: { xs: 2, sm: 1 } }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: black, mb: 2 }}>
          About
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: black, mb: 3, lineHeight: 1.7 }}
        >
          {aboutText}
        </Typography>
        <Button
          variant="contained"
          component={RouterLink}
          to="/about-enerhu"
          sx={{
            background: orange,
            color: white,
            fontWeight: 600,
            borderRadius: 1,
            px: 3,
            textTransform: "none",
            "&:hover": { background: black },
            mb: { xs: 3, md: 0 },
          }}
        >
          Read more
        </Button>
      </Box>
      {/* Image: right on sm+ screens, on top on mobile */}
      <Box
        sx={{
          flex: { xs: "1 1 100%", sm: "1 1 40%" },
          order: { xs: 1, sm: 2 },
          display: "flex",
          justifyContent: { xs: "flex-start", sm: "flex-end" },
        }}
      >
        <Paper
          elevation={3}
          sx={{
            overflow: "hidden",
            borderRadius: 4,
            width: "100%",
            maxWidth: 350, // Limit image width
            aspectRatio: "16/9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#eee",
            minHeight: 180,
            mx: "auto",
          }}
        >
          <img
            src={enerhuSite}
            alt="Enerhu Site"
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Paper>
      </Box>
    </Box>
  </Box>
  );
};

export default About;
