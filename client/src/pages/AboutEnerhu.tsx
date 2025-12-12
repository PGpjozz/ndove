import React from "react";
import { Box, Typography, Grid, Divider } from "@mui/material";
import Navbar from "../components/Navbar"; // Import your Navbar

const orange = "#ff8800";
const black = "#111";
const white = "#fff";

const AboutEnerhu: React.FC = () => {
  return (
    <Box sx={{ width: "100%", bgcolor: "#fdfdfd", minHeight: "100vh" }}>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <Box
        sx={{
          px: { xs: 3, md: 8 },
          py: { xs: 6, md: 10 },
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, color: orange, mb: 2 }}
          >
            About Enerhu Business Enterprise
          </Typography>
          <Divider
            sx={{
              width: 80,
              mx: "auto",
              borderBottomWidth: 3,
              bgcolor: orange,
              mb: 3,
            }}
          />
          <Typography
            variant="body1"
            sx={{
              color: black,
              maxWidth: 900,
              mx: "auto",
              fontSize: { xs: "0.95rem", md: "1.1rem" },
            }}
          >
            Enerhu Business Enterprise was founded in 2018 in Soweto, South
            Africa. We provide high-quality consulting, corporate training,
            learnerships, and HR solutions for businesses and individuals across
            South Africa and beyond.
          </Typography>
        </Box>

        {/* History */}
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: orange, mb: 2 }}
          >
            Our History
          </Typography>
          <Typography variant="body1" sx={{ color: black, mb: 2 }}>
            Enerhu started with a small team focused on empowering individuals
            through education and business solutions. Over the years, we have
            expanded our footprint to multiple provinces, partnering with
            organizations and professional bodies to deliver impactful training
            and consulting services.
          </Typography>
          <Typography variant="body1" sx={{ color: black }}>
            Today, Enerhu is recognized for its accredited programs, diverse
            portfolio of courses, and commitment to excellence in training and
            consulting.
          </Typography>
        </Box>

        {/* Vision & Mission */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 4,
                bgcolor: "#fff4e5",
                borderRadius: 2,
                height: "100%",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: orange, mb: 1 }}
              >
                Vision
              </Typography>
              <Typography variant="body1" sx={{ color: black }}>
                To make consulting, training, and online learning fun,
                affordable, and impactful, addressing both immediate and
                long-term needs of society.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 4,
                bgcolor: "#fef5f0",
                borderRadius: 2,
                height: "100%",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: orange, mb: 1 }}
              >
                Mission
              </Typography>
              <Typography variant="body1" sx={{ color: black }}>
                To remain at the cutting edge of technology and education,
                offering outstanding consulting and well-rounded academic
                programs.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Values */}
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: orange, mb: 2 }}
          >
            Our Values
          </Typography>
          <Grid container spacing={2}>
            {["Integrity", "Diversity", "Excellence", "Collaboration"].map(
              (val) => (
                <Grid item xs={6} md={3} key={val}>
                  <Box
                    sx={{
                      bgcolor: "#fff3e0",
                      py: 4,
                      borderRadius: 2,
                      textAlign: "center",
                      fontWeight: 700,
                      color: black,
                      fontSize: { xs: "0.9rem", md: "1.1rem" },
                    }}
                  >
                    {val}
                  </Box>
                </Grid>
              )
            )}
          </Grid>
        </Box>

        {/* Approach */}
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: orange, mb: 2 }}
          >
            Our Approach
          </Typography>
          <Typography variant="body1" sx={{ color: black, mb: 2 }}>
            Enerhu designs customized programs that meet every client’s
            requirements and preferences. Our process includes:
          </Typography>
          <ul style={{ paddingLeft: "1.5rem", color: black, fontSize: "1rem" }}>
            <li>Needs Analysis</li>
            <li>Research & Solution Design</li>
            <li>Development of Tailored Training Materials</li>
            <li>Delivery of High-Impact Training</li>
            <li>Evaluation & Feedback</li>
            <li>Certification & Post-Training Support</li>
          </ul>
        </Box>

        {/* Strategic Intent */}
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: orange, mb: 2 }}
          >
            Strategic Intent
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: black, fontSize: { xs: "0.95rem", md: "1.1rem" } }}
          >
            Enerhu is dedicated to providing world-class business services that
            help clients become more strategic, productive, and profitable. We
            aim to improve productivity, reduce costs, and add value to every
            client’s operations. Our CSR efforts uplift communities, create
            local economic opportunities, and generate jobs.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutEnerhu;
