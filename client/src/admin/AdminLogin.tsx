import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import enerhuLogo from "../assets/enerhu_logo.jpg";
import API_BASE from "../apiConfig";

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/api/token/`, {
        username,
        password,
      });

      const access = res.data.access as string;
      const refresh = res.data.refresh as string;

      localStorage.setItem("adminAccessToken", access);
      localStorage.setItem("adminRefreshToken", refresh);

      navigate("/admin-dashboard");
    } catch (err) {
      console.error("Admin login failed", err);
      setError("Invalid credentials or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh", // fill full viewport height
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #ff8800, #ffcc66)",
        px: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          elevation={12}
          sx={{
            p: 5,
            borderRadius: 3,
            width: "100%",
            maxWidth: 400,
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.95)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
          }}
        >
          <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
            <Box
              component="img"
              src={enerhuLogo}
              alt="Enerhu logo"
              sx={{
                height: 60,
                width: 120,
                borderRadius: 2,
                objectFit: "cover",
              }}
            />
          </Box>
          <Typography
            variant="h4"
            fontWeight={700}
            mb={3}
            sx={{ color: "#ff8800" }}
          >
            Admin Login
          </Typography>

          {error && (
            <Typography color="error" variant="body2" mb={1}>
              {error}
            </Typography>
          )}

          <TextField
            fullWidth
            label="Username"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              py: 1.5,
              fontWeight: 600,
              fontSize: "1rem",
              background: "linear-gradient(90deg, #ff8800, #ffcc66)",
              "&:hover": {
                background: "linear-gradient(90deg, #ffcc66, #ff8800)",
              },
              borderRadius: 2,
              boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
            }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default AdminLogin;
