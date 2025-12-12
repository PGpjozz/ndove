import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { motion } from "framer-motion";
import businessImg from "../assets/business_admin.jpeg";
import firefighterImg from "../assets/fire_fighter.jpeg";
import computingImg from "../assets/euc.png";
import healthImg from "../assets/health&safety.jpeg";
import securityImg from "../assets/security_practice.jpeg";
import callcenterImg from "../assets/call_center.jpeg";
import ventureImg from "../assets/new_venture.jpeg";
import firstaidImg from "../assets/first_aid.jpeg";
import fashionImg from "../assets/FashionDesigner.jpg";

const orange = "#ff9800";
const black = "#111";
const white = "#fff";

const courses = [
  { title: "Business Administration", img: businessImg },
  { title: "Fire Fighter", img: firefighterImg },
  { title: "End User Computing", img: computingImg },
  { title: "Health and Safety", img: healthImg },
  { title: "Security Practice", img: securityImg },
  { title: "Call Center", img: callcenterImg },
  { title: "New Venture Creation", img: ventureImg },
  { title: "First Aid", img: firstaidImg },
  { title: "Fashion Designer", img: fashionImg },
];

const MotionPaper = motion(Paper);

const PopularCourses: React.FC = () => (
  <Box sx={{ bgcolor: white, py: 8 }}>
    <Box sx={{ maxWidth: "1200px", mx: "auto", px: { xs: 2, md: 0 } }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: black,
          textAlign: "center",
          mb: 6,
        }}
      >
        Popular Courses
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={course.title}>
            <MotionPaper
              elevation={4}
              whileHover={{ y: -8, boxShadow: "0 10px 20px rgba(0,0,0,0.25)" }}
              transition={{ duration: 0.3 }}
              sx={{ borderRadius: 3, overflow: "hidden", cursor: "pointer" }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: 180,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <motion.img
                  src={course.img}
                  alt={course.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                />
              </Box>
              <Box
                sx={{
                  bgcolor: orange,
                  color: white,
                  textAlign: "center",
                  py: 1,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                }}
              >
                NQF LEVEL 5
              </Box>
            </MotionPaper>
            <Typography
              variant="h6"
              sx={{
                color: black,
                fontWeight: 700,
                textAlign: "center",
                mt: 2,
                transition: "all 0.3s ease",
                "&:hover": { color: orange },
              }}
            >
              {course.title}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  </Box>
);

export default PopularCourses;
