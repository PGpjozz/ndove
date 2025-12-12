import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Collapse,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import enerhuLogo from "../assets/enerhu_logo.jpg";

const orange = "#ff8800";
const black = "#111";
const white = "#fff";

const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [accAnchor, setAccAnchor] = useState<null | HTMLElement>(null);
  const [corpAnchor, setCorpAnchor] = useState<null | HTMLElement>(null);
  const [mobileAccOpen, setMobileAccOpen] = useState(false);
  const [mobileCorpOpen, setMobileCorpOpen] = useState(false);

  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  const handleAccClick = (e: React.MouseEvent<HTMLElement>) =>
    setAccAnchor(accAnchor ? null : e.currentTarget);
  const handleCorpClick = (e: React.MouseEvent<HTMLElement>) =>
    setCorpAnchor(corpAnchor ? null : e.currentTarget);

  const MotionMenuItem = motion(MenuItem);

  const linkHoverStyle = {
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      color: orange,
      transform: "scale(1.05)",
    },
  };

  return (
    <AppBar
      position="sticky"
      elevation={4}
      sx={{ bgcolor: white, color: black }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: black,
            ...linkHoverStyle,
          }}
        >
          <Box
            component="img"
            src={enerhuLogo}
            alt="Enerhu logo"
            sx={{
              height: 40,
              width: 80,
              borderRadius: 2,
              mr: 1,
              objectFit: "cover",
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Enerhu Business Enterprise
          </Typography>
        </Box>

        {/* Desktop Menu */}
        {!isMobile && (
          <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
            <Typography
              component={Link}
              to="/"
              sx={{ textDecoration: "none", color: black, ...linkHoverStyle }}
            >
              Home
            </Typography>

            {/* Corporate Training Dropdown */}
            <Box
              onClick={handleCorpClick}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                ...linkHoverStyle,
              }}
            >
              <Typography sx={{ mr: 0.5 }}>Corporate Training</Typography>
              <ExpandMoreIcon fontSize="small" />
            </Box>
            <Menu
              anchorEl={corpAnchor}
              open={Boolean(corpAnchor)}
              onClose={() => setCorpAnchor(null)}
              PaperProps={{ sx: { mt: 1, borderRadius: 2, boxShadow: 4 } }}
            >
              <MotionMenuItem
                component={Link}
                to="/learnerships"
                whileHover={{ x: 5, backgroundColor: orange, color: white }}
                onClick={() => setCorpAnchor(null)}
              >
                Learnerships
              </MotionMenuItem>
              <MotionMenuItem
                component={Link}
                to="/internships"
                whileHover={{ x: 5, backgroundColor: orange, color: white }}
                onClick={() => setCorpAnchor(null)}
              >
                Internships
              </MotionMenuItem>
            </Menu>

            <Typography
              component={Link}
              to="/about-enerhu"
              sx={{ textDecoration: "none", color: black, ...linkHoverStyle }}
            >
              About Us
            </Typography>
            <Typography
              component={Link}
              to="/gallery"
              sx={{ textDecoration: "none", color: black, ...linkHoverStyle }}
            >
              Gallery
            </Typography>

            <Typography
              component={Link}
              to="/contact"
              sx={{ textDecoration: "none", color: black, ...linkHoverStyle }}
            >
              Contact
            </Typography>

            <Typography
              component={Link}
              to="/enroll"
              sx={{
                textDecoration: "none",
                color: black,
                fontWeight: 700,
                border: `2px solid ${orange}`,
                px: 2,
                py: 0.5,
                borderRadius: 2,
                ...linkHoverStyle,
                "&:hover": {
                  color: white,
                  backgroundColor: orange,
                  transform: "scale(1.05)",
                },
              }}
            >
              Enroll
            </Typography>
          </Box>
        )}

        {/* Mobile Menu */}
        {isMobile && (
          <IconButton onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer}>
        <List sx={{ width: 250 }}>
          <ListItemButton component={Link} to="/" onClick={toggleDrawer}>
            <ListItemText primary="Home" />
          </ListItemButton>

          {/* Mobile Corporate Training */}
          <ListItemButton onClick={() => setMobileCorpOpen(!mobileCorpOpen)}>
            <ListItemText primary="Corporate Training" />
            <ExpandMoreIcon
              sx={{
                transform: mobileCorpOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s",
              }}
            />
          </ListItemButton>
          <Collapse in={mobileCorpOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 4 }}>
              <ListItemButton component={Link} to="/learnerships" onClick={toggleDrawer}>
                <ListItemText primary="Learnerships" />
              </ListItemButton>
              <ListItemButton component={Link} to="/internships" onClick={toggleDrawer}>
                <ListItemText primary="Internships" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton
            component={Link}
            to="/about-enerhu"
            onClick={toggleDrawer}
          >
            <ListItemText primary="About Us" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            to="/gallery"
            onClick={toggleDrawer}
          >
            <ListItemText primary="Gallery" />
          </ListItemButton>
          <ListItemButton component={Link} to="/contact" onClick={toggleDrawer}>
            <ListItemText primary="Contact" />
          </ListItemButton>
          <ListItemButton component={Link} to="/enroll" onClick={toggleDrawer}>
            <ListItemText primary="Enroll" />
          </ListItemButton>
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
