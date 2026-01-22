import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  InputBase,
  IconButton,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { FaUserTie, FaGraduationCap, FaUsers } from "react-icons/fa6";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE from "../apiConfig";

const heroImage =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";

const cardData = [
  {
    title: "Training Solutions",
    desc: "Accredited skills development, learnership and internship implementation.",
    icon: <FaUserTie size={40} color="#fff" />,
  },
  {
    title: "Human Capital Development",
    desc: "Practical training, consulting support, and workforce development.",
    icon: <FaGraduationCap size={40} color="#fff" />,
  },
  {
    title: "Enerhu Technologies",
    desc: "IT infrastructure implementation, maintenance, upgrades, and outsourcing.",
    icon: <FaUsers size={40} color="#fff" />,
  },
];

const orange = "#ff9800";
const black = "#111";
const white = "#fff";

type Opportunity = {
  id: number;
  title: string;
  type: string;
  description?: string;
};

const Hero: React.FC = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loadingOpps, setLoadingOpps] = useState(false);
  const [oppsError, setOppsError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const fetchOpps = async () => {
      try {
        setLoadingOpps(true);
        setOppsError(null);
        const res = await axios.get(`${API_BASE}/api/opportunities/`);
        setOpportunities(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error loading opportunities", err);
        setOppsError("Could not load programmes.");
      } finally {
        setLoadingOpps(false);
      }
    };

    fetchOpps();
  }, []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as Opportunity[];
    return opportunities
      .filter((o) => (o?.title || "").toLowerCase().includes(q))
      .slice(0, 6);
  }, [opportunities, query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    const first = suggestions[0];
    if (first?.type && first?.title) {
      navigate(
        `/enroll?type=${encodeURIComponent(first.type)}&title=${encodeURIComponent(
          first.title
        )}`
      );
      return;
    }

    const lower = q.toLowerCase();
    if (lower.includes("learn")) {
      navigate("/learnerships");
      return;
    }
    if (lower.includes("intern")) {
      navigate("/internships");
      return;
    }
  };

  const showDropdown = isFocused && query.trim().length > 0;

  return (
    <Box sx={{ position: "relative", width: "100%", bgcolor: white }}>
    {/* Hero Image */}
    <Box
      sx={{
        width: "100%",
        height: { xs: 360, md: 420 },
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
        <Box sx={{ textAlign: "center", px: 2 }}>
          <Typography
            variant="h4"
            sx={{
              color: white,
              fontWeight: 800,
              textShadow: "0 2px 10px rgba(0,0,0,0.75)",
              letterSpacing: 0.5,
              fontSize: { xs: "1.4rem", md: "2.1rem" },
              lineHeight: 1.2,
            }}
          >
            We do business the extraordinary way
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              mt: 1,
              color: white,
              textShadow: "0 2px 10px rgba(0,0,0,0.75)",
              maxWidth: 820,
              mx: "auto",
              fontSize: { xs: "0.95rem", md: "1.05rem" },
            }}
          >
            Accredited training, learnership and internship implementation, and
            practical workforce development.
          </Typography>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "center",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              onClick={() => navigate("/contact")}
              sx={{
                background: orange,
                color: white,
                fontWeight: 700,
                textTransform: "none",
                px: 3,
                "&:hover": { background: "#e67600" },
              }}
            >
              Enquire Now
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/about-enerhu")}
              sx={{
                borderColor: "rgba(255,255,255,0.9)",
                color: white,
                fontWeight: 700,
                textTransform: "none",
                px: 3,
                "&:hover": { borderColor: white, background: "rgba(0,0,0,0.15)" },
              }}
            >
              About Enerhu
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Search Bar */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          top: { xs: 220, md: 220 },
          display: "flex",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <Paper
          component="form"
          onSubmit={handleSearchSubmit}
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              window.setTimeout(() => setIsFocused(false), 150);
            }}
          />
          <IconButton
            type="submit"
            sx={{ p: "10px", color: orange }}
            aria-label="search"
          >
            {loadingOpps ? <CircularProgress size={18} sx={{ color: orange }} /> : <SearchIcon />}
          </IconButton>
        </Paper>

        {showDropdown && (
          <Paper
            elevation={4}
            sx={{
              position: "absolute",
              top: "calc(100% + 8px)",
              width: { xs: "90%", md: 500 },
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.08)",
              bgcolor: "#fff",
              zIndex: 11,
            }}
          >
            {oppsError ? (
              <Box sx={{ p: 1.5 }}>
                <Typography variant="body2" color="error">
                  {oppsError}
                </Typography>
              </Box>
            ) : suggestions.length === 0 ? (
              <Box sx={{ p: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  No results.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {suggestions.map((o) => (
                  <Button
                    key={o.id}
                    onClick={() => {
                      navigate(
                        `/enroll?type=${encodeURIComponent(
                          o.type
                        )}&title=${encodeURIComponent(o.title)}`
                      );
                    }}
                    sx={{
                      justifyContent: "space-between",
                      textTransform: "none",
                      color: black,
                      px: 1.5,
                      py: 1,
                      borderRadius: 0,
                    }}
                  >
                    <Box sx={{ minWidth: 0, textAlign: "left" }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {o.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {o.type}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: orange, ml: 2 }}>
                      Apply
                    </Typography>
                  </Button>
                ))}
              </Box>
            )}
          </Paper>
        )}
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
};

export default Hero;
