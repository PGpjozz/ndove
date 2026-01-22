import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  InputBase,
  Button,
  IconButton,
  Link as MuiLink,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { Link as RouterLink } from "react-router-dom";
import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa6";
import { motion } from "framer-motion";
import pjozzLogo from "../assets/pjozz_technologies_logo.svg";
import qtcoLogo from "../assets/qtco.png";
import higherEduLogo from "../assets/higher_education_logo.png";

const orange = "#ff9800";
const black = "#111";
const white = "#fff";

const socialLinks = [
  { icon: <FaFacebookF />, label: "Facebook", url: "#" },
  { icon: <FaXTwitter />, label: "X", url: "#" },
  { icon: <FaInstagram />, label: "Instagram", url: "#" },
  { icon: <FaYoutube />, label: "YouTube", url: "#" },
  { icon: <FaLinkedinIn />, label: "LinkedIn", url: "#" },
];

const quickLinks = [
  { label: "Home", url: "/" },
  { label: "About Us", url: "/about-enerhu" },
  { label: "Learnerships", url: "/learnerships" },
  { label: "Internships", url: "/internships" },
  { label: "Gallery", url: "/gallery" },
  { label: "Contact", url: "/contact" },
  { label: "Enroll", url: "/enroll" },
];

const MotionBox = motion(Box);
const MotionButton = motion(Button);
const MotionLink = motion(MuiLink);

const Footer: React.FC = () => (
  <Box sx={{ bgcolor: black, color: white, pt: 6 }}>
    {/* Newsletter Section */}
    <MotionBox
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      sx={{ textAlign: "center", mb: 6 }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, mb: 2, letterSpacing: 1.2 }}
      >
        SUBSCRIBE TO OUR NEWSLETTER
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <MotionBox
          component="form"
          whileHover={{ scale: 1.02, boxShadow: "0 8px 20px rgba(0,0,0,0.3)" }}
          sx={{
            display: "flex",
            alignItems: "center",
            width: { xs: "80%", sm: 400 },
            borderRadius: 2,
            boxShadow: 3,
            bgcolor: white,
            overflow: "hidden",
            transition: "all 0.3s",
          }}
        >
          <IconButton sx={{ color: orange }}>
            <EmailIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1, color: black }}
            placeholder="Your email"
            inputProps={{ "aria-label": "newsletter email" }}
          />
        </MotionBox>
        <MotionButton
          whileHover={{
            scale: 1.05,
            boxShadow: "0 6px 20px rgba(255,136,0,0.5)",
          }}
          variant="contained"
          sx={{
            bgcolor: orange,
            color: white,
            fontWeight: 700,
            px: 4,
            py: 1.5,
            borderRadius: 2,
            boxShadow: 3,
            textTransform: "none",
          }}
        >
          Sign Up
        </MotionButton>
      </Box>
    </MotionBox>

    {/* Main Footer */}
    <Box sx={{ bgcolor: "#111", px: { xs: 3, md: 8 }, py: 8 }}>
      <Grid container spacing={6}>
        {/* Logos */}
        <Grid item xs={12} md={3}>
          <MotionBox
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <img
                src={qtcoLogo}
                alt="QCTO Logo"
                loading="lazy"
                style={{ width: "100%", borderRadius: 8 }}
              />
              <img
                src={higherEduLogo}
                alt="Higher Education Logo"
                loading="lazy"
                style={{ width: "100%", borderRadius: 8 }}
              />
              <Box
                sx={{
                  mt: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 0.5,
                }}
              >
                <Typography sx={{ color: white, fontSize: 13 }}>
                  Developed by Pjozz Technologies
                </Typography>
                <Box
                  component="img"
                  src={pjozzLogo}
                  alt="Pjozz Technologies logo"
                  sx={{
                    height: 36,
                    width: "100%",
                    maxWidth: 220,
                    borderRadius: 1,
                    objectFit: "contain",
                    bgcolor: "#000",
                    p: 0.5,
                  }}
                />
              </Box>
            </Box>
          </MotionBox>
        </Grid>

        {/* Contact */}
        <Grid item xs={12} md={3}>
          <MotionBox
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Contact Us
            </Typography>
            <Typography>
              656 Mukhomi Village, Opp Mukhomi Tribal Authority, Malamulele,
              0982
            </Typography>
            <Typography sx={{ mt: 1 }}>Tel: (012) 023 1737</Typography>
            <Typography>Cell: (071) 149 3310</Typography>
            <Typography sx={{ mt: 1 }}>rhulanindobe@enerhu.co.za</Typography>
            <Typography>enerhu@enerhu.co.za</Typography>
          </MotionBox>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={12} md={3}>
          <MotionBox
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {quickLinks.map((link) => (
                <MotionLink
                  key={link.label}
                  component={RouterLink}
                  to={link.url}
                  underline="hover"
                  whileHover={{ scale: 1.05, color: orange, ml: 1 }}
                  sx={{ color: white, transition: "0.3s" }}
                >
                  {link.label}
                </MotionLink>
              ))}
            </Box>
          </MotionBox>
        </Grid>

        {/* Socials */}
        <Grid item xs={12} md={3}>
          <MotionBox
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Follow Us
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {socialLinks.map((social) => (
                <MotionButton
                  key={social.label}
                  startIcon={social.icon}
                  href={social.url}
                  whileHover={{ x: 5, scale: 1.05, color: orange }}
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    color: white,
                    background: "transparent",
                  }}
                >
                  {social.label}
                </MotionButton>
              ))}
            </Box>
          </MotionBox>
        </Grid>
      </Grid>
    </Box>

    {/* Copyright */}
    <Box sx={{ bgcolor: "#000", py: 3, textAlign: "center" }}>
      <Typography sx={{ color: white, fontWeight: 500 }}>
        Enerhu &copy; {new Date().getFullYear()} All Rights Reserved.
      </Typography>
    </Box>
  </Box>
);

export default Footer;
