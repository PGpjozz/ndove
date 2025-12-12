import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Stack,
  Chip,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import API_BASE from "../apiConfig";

const orange = "#ff8800";

const titles = ["Mr", "Mrs", "Ms", "Dr", "Prof"];
const nationalities = ["South African", "Other"];
const genders = ["Male", "Female", "Other"];
const languages = [
  "Afrikaans",
  "English",
  "isiNdebele",
  "isiXhosa",
  "isiZulu",
  "Sepedi",
  "Sesotho",
  "Setswana",
  "siSwati",
  "Tshivenda",
  "Xitsonga",
  "South African Sign Language",
];
const socioEconomicStatus = ["Low", "Medium", "High"];
const disabilityStatus = ["None", "Physical", "Visual", "Hearing", "Other"];
const provinces = [
  "Gauteng",
  "KwaZulu-Natal",
  "Western Cape",
  "Eastern Cape",
  "Mpumalanga",
  "Limpopo",
  "North West",
  "Free State",
  "Northern Cape",
];
const qualifications = [
  "Grade 11",
  "Grade 12",
  "Certificate",
  "Diploma",
  "Other",
];

const steps = [
  "Personal Info",
  "Identification",
  "Contact Info",
  "Qualifications & Documents",
];

const Enroll: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const opportunityType = searchParams.get("type");
  const opportunityTitle = searchParams.get("title");
  const [manualOpportunityType, setManualOpportunityType] = useState("");
  const [manualOpportunityTitle, setManualOpportunityTitle] = useState("");
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loadingOpps, setLoadingOpps] = useState(false);
  const [oppsError, setOppsError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [dob, setDob] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    title: "",
    idNumber: "",
    equityCode: "",
    nationality: "",
    gender: "",
    homeLanguage: "",
    socioEconomicStatus: "",
    disabilityStatus: "",
    homeAddress: "",
    province: "",
    highestQualification: "",
    idFile: null as File | null,
    qualificationFile: null as File | null,
    otherFile: null as File | null,
  });

  // Load available programs (internships / learnerships) when opened
  useEffect(() => {
    // If the user came from a specific opportunity link, no need to load list
    if (opportunityType && opportunityTitle) {
      return;
    }
    const fetchOpps = async () => {
      try {
        setLoadingOpps(true);
        setOppsError(null);
        const res = await axios.get(`${API_BASE}/api/opportunities/`);
        setOpportunities(res.data || []);
      } catch (err) {
        console.error("Error loading opportunities", err);
        setOppsError("Could not load available programmes.");
      } finally {
        setLoadingOpps(false);
      }
    };
    fetchOpps();
  }, [opportunityType, opportunityTitle]);

  // Input change handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "idNumber") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 13);
      setFormData({ ...formData, [name]: digitsOnly });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const isValidSouthAfricanIdNumber = (idNumber: string) => /^\d{13}$/.test(idNumber);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [field]: e.target.files[0] });
    }
  };

  const handleRemoveFile = (field: string) => {
    setFormData({ ...formData, [field]: null });
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      alert("Please fill in all required fields for this step.");
    }
  };

  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  // Step validation
  const validateStep = (step: number) => {
    switch (step) {
      case 0:
        return formData.title && formData.firstName && formData.lastName && dob;
      case 1:
        return (
          isValidSouthAfricanIdNumber(formData.idNumber) &&
          formData.nationality &&
          formData.gender &&
          formData.homeLanguage &&
          formData.socioEconomicStatus &&
          formData.disabilityStatus
        );
      case 2:
        return formData.homeAddress && formData.province;
      case 3:
        return (
          formData.highestQualification &&
          formData.idFile &&
          formData.qualificationFile
        );
      default:
        return false;
    }
  };

  // Form submission to Django backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Final validation before sending
    if (!validateStep(activeStep)) {
      alert("Please complete all required fields and upload necessary files.");
      return;
    }

    const finalOpportunityType = opportunityType || manualOpportunityType;
    const finalOpportunityTitle = opportunityTitle || manualOpportunityTitle;

    if (!finalOpportunityType || !finalOpportunityTitle) {
      alert(
        "Please select whether you are applying for an internship or learnership and provide the opportunity title."
      );
      return;
    }

    const form = new FormData();
    form.append("first_name", formData.firstName);
    form.append("middle_name", formData.middleName);
    form.append("last_name", formData.lastName);
    form.append("title", formData.title);
    form.append("dob", dob?.toISOString() || "");
    form.append("id_number", formData.idNumber);
    form.append("equity_code", formData.equityCode);
    form.append("nationality", formData.nationality);
    form.append("gender", formData.gender);
    form.append("home_language", formData.homeLanguage);
    form.append("socio_economic_status", formData.socioEconomicStatus);
    form.append("disability_status", formData.disabilityStatus);
    form.append("home_address", formData.homeAddress);
    form.append("province", formData.province);
    form.append("highest_qualification", formData.highestQualification);
    form.append("opportunity_type", finalOpportunityType);
    form.append("opportunity_title", finalOpportunityTitle);
    if (formData.idFile) form.append("id_file", formData.idFile);
    if (formData.qualificationFile)
      form.append("qualification_file", formData.qualificationFile);
    if (formData.otherFile) form.append("other_file", formData.otherFile);

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `${API_BASE}/api/applications/`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Form submitted successfully!");
      console.log(response.data);
      // Optionally reset form
      setActiveStep(0);
      setDob(null);
      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        title: "",
        idNumber: "",
        equityCode: "",
        nationality: "",
        gender: "",
        homeLanguage: "",
        socioEconomicStatus: "",
        disabilityStatus: "",
        homeAddress: "",
        province: "",
        highestQualification: "",
        idFile: null,
        qualificationFile: null,
        otherFile: null,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render each step
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <TextField
              select
              label="Title"
              name="title"
              fullWidth
              value={formData.title}
              onChange={handleChange}
              required
            >
              {titles.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="First Name"
              name="firstName"
              fullWidth
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <TextField
              label="Middle Name"
              name="middleName"
              fullWidth
              value={formData.middleName}
              onChange={handleChange}
            />
            <TextField
              label="Last Name"
              name="lastName"
              fullWidth
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date of Birth"
                value={dob}
                onChange={(newDate) => setDob(newDate)}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </LocalizationProvider>
          </Stack>
        );
      case 1:
        return (
          <Stack spacing={2}>
            <TextField
              label="ID Number"
              name="idNumber"
              fullWidth
              value={formData.idNumber}
              onChange={handleChange}
              inputProps={{ inputMode: "numeric", pattern: "\\d*", maxLength: 13 }}
              error={Boolean(formData.idNumber) && !isValidSouthAfricanIdNumber(formData.idNumber)}
              helperText={
                Boolean(formData.idNumber) && !isValidSouthAfricanIdNumber(formData.idNumber)
                  ? "ID number must be exactly 13 digits."
                  : ""
              }
              required
            />
            <TextField
              label="Equity Code (Optional)"
              name="equityCode"
              fullWidth
              value={formData.equityCode}
              onChange={handleChange}
            />
            <TextField
              select
              label="Nationality"
              name="nationality"
              fullWidth
              value={formData.nationality}
              onChange={handleChange}
              required
            >
              {nationalities.map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Gender"
              name="gender"
              fullWidth
              value={formData.gender}
              onChange={handleChange}
              required
            >
              {genders.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Home Language"
              name="homeLanguage"
              fullWidth
              value={formData.homeLanguage}
              onChange={handleChange}
              required
            >
              {languages.map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {lang}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Socio-Economic Status"
              name="socioEconomicStatus"
              fullWidth
              value={formData.socioEconomicStatus}
              onChange={handleChange}
              required
            >
              {socioEconomicStatus.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Disability Status"
              name="disabilityStatus"
              fullWidth
              value={formData.disabilityStatus}
              onChange={handleChange}
              required
            >
              {disabilityStatus.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        );
      case 2:
        return (
          <Stack spacing={2}>
            <TextField
              label="Home Address"
              name="homeAddress"
              fullWidth
              value={formData.homeAddress}
              onChange={handleChange}
              required
              multiline
              minRows={2}
            />
            <TextField
              select
              label="Province"
              name="province"
              fullWidth
              value={formData.province}
              onChange={handleChange}
              required
            >
              {provinces.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        );
      case 3:
        return (
          <Stack spacing={2}>
            <TextField
              select
              label="Highest Qualification"
              name="highestQualification"
              fullWidth
              value={formData.highestQualification}
              onChange={handleChange}
              required
            >
              {qualifications.map((q) => (
                <MenuItem key={q} value={q}>
                  {q}
                </MenuItem>
              ))}
            </TextField>
            {["idFile", "qualificationFile", "otherFile"].map((field) => (
              <Box key={field}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<UploadFileIcon />}
                  sx={{ bgcolor: orange, "&:hover": { bgcolor: "#e67600" } }}
                >
                  {field === "idFile"
                    ? "Upload ID"
                    : field === "qualificationFile"
                    ? "Upload Qualification"
                    : "Upload Other Document (Optional)"}
                  <input
                    type="file"
                    hidden
                    name={field}
                    accept=".jpg,.png,.pdf"
                    onChange={(e) => handleFileChange(e, field)}
                  />
                </Button>
                {formData[field as keyof typeof formData] && (
                  <Chip
                    label={
                      (formData[field as keyof typeof formData] as File).name
                    }
                    size="small"
                    sx={{ mt: 0.5 }}
                    onDelete={() => handleRemoveFile(field)}
                  />
                )}
              </Box>
            ))}
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          bgcolor:
            "linear-gradient(135deg, #fff7e6 0%, #ffe0b3 40%, #ffffff 100%)",
          display: "flex",
          justifyContent: "center",
          py: 5,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: { xs: "100%", sm: "95%", md: "900px", lg: "1100px" },
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            boxShadow:
              "0 10px 25px rgba(0,0,0,0.12), 0 4px 10px rgba(0,0,0,0.08)",
            border: "1px solid rgba(0,0,0,0.05)",
            bgcolor: "#ffffff",
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: orange, textAlign: "center", mb: 3 }}
          >
            Learner Enrollment Form
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ textAlign: "center", mb: 1, color: "text.secondary" }}
            >
              {opportunityType || manualOpportunityType
                ? `Applying for: ${opportunityType || manualOpportunityType} ${
                    opportunityTitle || manualOpportunityTitle
                      ? `- ${opportunityTitle || manualOpportunityTitle}`
                      : ""
                  }`
                : "Please choose the opportunity you are applying for."}
            </Typography>
            {!opportunityType && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 2,
                  mt: 1,
                }}
              >
                <TextField
                  select
                  label="Opportunity Type"
                  fullWidth
                  value={manualOpportunityType}
                  onChange={(e) => {
                    setManualOpportunityType(e.target.value);
                    // Clear previously selected programme when type changes
                    setManualOpportunityTitle("");
                  }}
                  required
                >
                  <MenuItem value="learnership">Learnership</MenuItem>
                  <MenuItem value="internship">Internship</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Programme"
                  fullWidth
                  value={manualOpportunityTitle}
                  onChange={(e) => setManualOpportunityTitle(e.target.value)}
                  required
                  disabled={loadingOpps || !manualOpportunityType}
                  helperText={
                    oppsError
                      ? oppsError
                      : loadingOpps
                      ? "Loading programmes..."
                      : !manualOpportunityType
                      ? "Select a type first"
                      : "Select the specific internship or learnership"
                  }
                >
                  {opportunities
                    .filter(
                      (opp) =>
                        !manualOpportunityType || opp.type === manualOpportunityType
                    )
                    .map((opp) => (
                      <MenuItem key={opp.id} value={opp.title}>
                        {opp.title}
                      </MenuItem>
                    ))}
                </TextField>
              </Box>
            )}
          </Box>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {renderStepContent(activeStep)}

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button disabled={activeStep === 0 || isSubmitting} onClick={handleBack}>
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    bgcolor: orange,
                    px: 4,
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "#e67600" },
                  }}
                >
                  {isSubmitting ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CircularProgress size={18} sx={{ color: "#fff" }} />
                      <span>Submitting…</span>
                    </Box>
                  ) : (
                    "Submit"
                  )}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    bgcolor: orange,
                    px: 4,
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "#e67600" },
                  }}
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default Enroll;
