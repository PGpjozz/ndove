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
            Enerhu Business Enterprise (Pty) Ltd (2015/268631/07) was
            established in 2015 as a 100% youth black owned enterprise.
            We promote and encourage previously disadvantaged communities,
            especially in rural areas, to participate in economic activities in
            South Africa. Our primary focus is Human Capital Development,
            consulting services, and Training and Development (learnerships,
            internships, short learning programmes, and apprenticeships).
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
            Enerhu Business Enterprise was founded to unlock opportunity through
            extraordinary business relations and practical skills development.
            Our work focuses on creating sustainable jobs, supporting SMMEs, and
            closing unemployment gaps by implementing learnerships, internships,
            skills programmes, and business solutions.
          </Typography>
          <Typography variant="body1" sx={{ color: black }}>
            We are continuously expanding our service offering through dedicated
            divisions designed to ensure that no client or community need is left
            unattended.
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
                To be a preferred extraordinary service provider.
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
                To be a pillar in the development of local communities, regional
                structures, provincial and national sectors by offering extra
                ordinary business relations that will unlock doors in the
                international markets, thereby ensuring sustainable jobs more
                especially in our rural communities, South Africa, Africa and
                the world.
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

        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: orange, mb: 2 }}
          >
            Our Services
          </Typography>
          <Typography variant="body1" sx={{ color: black, mb: 3 }}>
            We have expanded our service offering through various divisions
            dedicated to catering for the majority of business needs in our
            communities.
          </Typography>

          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: orange, mb: 1 }}
          >
            Enerhu Training Solutions
          </Typography>
          <Typography variant="body1" sx={{ color: black, mb: 2 }}>
            A National and International Accredited training provider capable of
            translating and implementing skills development initiatives for
            improvement of business drivers and objectives.
          </Typography>
          <ul style={{ paddingLeft: "1.5rem", color: black, fontSize: "1rem" }}>
            <li>Skills Development Services</li>
            <li>Accreditation and Quality Assurance</li>
            <li>Assessment and Moderation Services</li>
            <li>Workshops and Seminars</li>
            <li>Recruitment and Candidate Selection</li>
            <li>Learnership and Internship Implementation</li>
            <li>Graduate Placement and Hosting</li>
            <li>Project Management Services</li>
            <li>Basic and Technical ICT Training</li>
            <li>ODETDP: Train the Trainer, Facilitator, Assessor and Moderator</li>
            <li>International Exam Facilitation</li>
            <li>Construction Related Training Programmes</li>
            <li>Clothing Manufacturing and New Venture Creation</li>
          </ul>

          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: orange, mt: 4, mb: 1 }}
          >
            Enerhu Technologies
          </Typography>
          <Typography variant="body1" sx={{ color: black, mb: 2 }}>
            This division focuses on the implementation and maintenance of IT
            infrastructures at both small and large scale.
          </Typography>
          <ul style={{ paddingLeft: "1.5rem", color: black, fontSize: "1rem" }}>
            <li>IT Networking</li>
            <li>IT Infrastructure Support</li>
            <li>IT Maintenance and Upgrade</li>
            <li>IT Outsourcing Services</li>
          </ul>
        </Box>

        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: orange, mb: 2 }}
          >
            Accreditations
          </Typography>
          <Typography variant="body1" sx={{ color: black, mb: 2 }}>
            We are accredited with multiple professional bodies and SETAs,
            including Service SETA, CETA, FP&amp;M SETA, AgriSETA, Bank SETA,
            QCTO, and MICT SETA.
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: orange, mb: 2 }}
          >
            Addresses & Contacts
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: black, mb: 1 }}>
                Gauteng Office
              </Typography>
              <Typography variant="body1" sx={{ color: black }}>
                21st Floor, 222 Smit Street, Braamfontein, Johannesburg
              </Typography>
              <Typography variant="body1" sx={{ color: black, mt: 1 }}>
                Tel: (010) 005 4500
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: black, mb: 1 }}>
                Limpopo Head Office
              </Typography>
              <Typography variant="body1" sx={{ color: black }}>
                656 Mukhomi Village, Opp Mukhomi Tribal Authority, Malamulele,
                0982
              </Typography>
              <Typography variant="body1" sx={{ color: black, mt: 1 }}>
                Tel: (012) 023 1737
              </Typography>
              <Typography variant="body1" sx={{ color: black }}>
                Cell: (071) 149 3310
              </Typography>
              <Typography variant="body1" sx={{ color: black }}>
                Fax: (086) 690 2899
              </Typography>
              <Typography variant="body1" sx={{ color: black, mt: 1 }}>
                Email: rhulanindobe@enerhu.co.za
              </Typography>
              <Typography variant="body1" sx={{ color: black }}>
                Email: enerhu@enerhu.co.za
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Strategic Intent */}
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: orange, mb: 2 }}
          >
            Conclusion
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: black, fontSize: { xs: "0.95rem", md: "1.1rem" } }}
          >
            We have achieved satisfactory performance, exceeding client
            requirements. We will continue to promote and expand our activities
            to support SMMEs and close unemployment gaps, especially in rural
            communities.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutEnerhu;
