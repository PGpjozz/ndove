import React, { useEffect, useState } from "react";
import {
  Alert,
  AppBar,
  Box,
  CircularProgress,
  Chip,
  Drawer,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Grid,
  Button,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Stack,
  Tooltip,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE from "../apiConfig";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import WorkIcon from "@mui/icons-material/Work";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import SettingsIcon from "@mui/icons-material/Settings";
import FilterListIcon from "@mui/icons-material/FilterList";
import MenuIcon from "@mui/icons-material/Menu";
import ApplicationsSection from "./sections/ApplicationsSection";
import LearnersSection from "./sections/LearnersSection";
import OpportunitiesSection from "./sections/OpportunitiesSection";
import GallerySection from "./sections/GallerySection";
import SettingsSection from "./sections/SettingsSection";
import EnquiriesSection from "./sections/EnquiriesSection";

const menuItems = [
  { label: "Pending Applications", icon: <AssignmentIcon fontSize="small" /> },
  { label: "Declined Applications", icon: <AssignmentIcon fontSize="small" /> },
  { label: "Learners / Interns", icon: <WorkIcon fontSize="small" /> },
  { label: "Dismissed", icon: <WorkIcon fontSize="small" /> },
  { label: "Internships / Learnerships", icon: <WorkIcon fontSize="small" /> },
  { label: "Gallery", icon: <PhotoLibraryIcon fontSize="small" /> },
  { label: "Enquiries", icon: <MailOutlineIcon fontSize="small" /> },
  { label: "Settings", icon: <SettingsIcon fontSize="small" /> },
];

const AdminDashboard: React.FC = () => {
  const [selected, setSelected] = useState("Pending Applications");
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [appsError, setAppsError] = useState<string | null>(null);
  const [appsStatus, setAppsStatus] = useState<
    "pending" | "approved" | "declined"
  >("pending");
  const [applicationsFilter, setApplicationsFilter] = useState<
    "all" | "internship" | "learnership"
  >("all");
  const [searchId, setSearchId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loadingOpps, setLoadingOpps] = useState(false);
  const [oppsError, setOppsError] = useState<string | null>(null);
  const [galleryPosts, setGalleryPosts] = useState<any[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [newOppTitle, setNewOppTitle] = useState("");
  const [newOppType, setNewOppType] = useState("internship");
  const [newOppDescription, setNewOppDescription] = useState("");
  const [newGalleryCaption, setNewGalleryCaption] = useState("");
  const [newGalleryBody, setNewGalleryBody] = useState("");
  const [newGalleryImage, setNewGalleryImage] = useState<File | null>(null);
  const [selectedGalleryPost, setSelectedGalleryPost] = useState<any | null>(
    null
  );
  const [companyProfileUrl, setCompanyProfileUrl] = useState<string | null>(
    null
  );
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [applicationsSort, setApplicationsSort] = useState<
    "newest" | "oldest" | "name"
  >("newest");

  const [learners, setLearners] = useState<any[]>([]);
  const [loadingLearners, setLoadingLearners] = useState(false);
  const [learnersError, setLearnersError] = useState<string | null>(null);
  const [learnerStatus, setLearnerStatus] = useState<"active" | "dismissed">(
    "active"
  );

  const [learnerTypeFilter, setLearnerTypeFilter] = useState<
    "all" | "internship" | "learnership"
  >("all");
  const [learnerProgramFilter, setLearnerProgramFilter] = useState("all");
  const [learnerSearch, setLearnerSearch] = useState("");
  const [learnersSort, setLearnersSort] = useState<"newest" | "oldest" | "name">(
    "newest"
  );

  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [enquiriesError, setEnquiriesError] = useState<string | null>(null);

  // Confirmation dialog state for destructive actions
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "info" | "warning" | "error"
  >("info");

  const notify = (
    message: string,
    severity: "success" | "info" | "warning" | "error" = "info"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const [applicationDetails, setApplicationDetails] = useState<any | null>(null);
  const [learnerDetails, setLearnerDetails] = useState<any | null>(null);

  const isDesktop = useMediaQuery("(min-width:900px)");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [counts, setCounts] = useState<{
    pending: number | null;
    declined: number | null;
    active: number | null;
    dismissed: number | null;
  }>({ pending: null, declined: null, active: null, dismissed: null });

  const openConfirm = (title: string, message: string, action: () => void) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setConfirmOpen(true);
  };

  const navigate = useNavigate();

  const resolveFileUrl = (path?: string | null) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${base}${p}`;
  };

  const handleAuthError = (err: any) => {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      localStorage.removeItem("adminAccessToken");
      localStorage.removeItem("adminRefreshToken");
      navigate("/admin-login");
      return true;
    }
    return false;
  };

  const authHeaders = () => {
    const token = localStorage.getItem("adminAccessToken");
    return token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
    navigate("/admin-login");
  };

  const statusChipColor = (status?: string) => {
    if (status === "pending") return "warning";
    if (status === "approved") return "success";
    if (status === "declined") return "error";
    if (status === "dismissed") return "default";
    if (status === "active") return "success";
    return "default";
  };

  const toCsvValue = (value: any) => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    const escaped = str.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const downloadLearnersCsv = (rows: any[]) => {
    const headers = [
      "id",
      "first_name",
      "middle_name",
      "last_name",
      "id_number",
      "opportunity_type",
      "opportunity_title",
      "province",
      "status",
      "created_at",
    ];
    const lines = [headers.join(",")];
    for (const r of rows) {
      lines.push(headers.map((h) => toCsvValue(r?.[h])).join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `learners_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const refreshCounts = async () => {
      try {
        const [pendingRes, declinedRes, activeRes, dismissedRes] = await Promise.all([
          axios.get(`${API_BASE}/api/applications/`, {
            headers: authHeaders(),
            params: { status: "pending" },
          }),
          axios.get(`${API_BASE}/api/applications/`, {
            headers: authHeaders(),
            params: { status: "declined" },
          }),
          axios.get(`${API_BASE}/api/learners/`, {
            headers: authHeaders(),
            params: { status: "active" },
          }),
          axios.get(`${API_BASE}/api/learners/`, {
            headers: authHeaders(),
            params: { status: "dismissed" },
          }),
        ]);

        setCounts({
          pending: Array.isArray(pendingRes.data) ? pendingRes.data.length : null,
          declined: Array.isArray(declinedRes.data) ? declinedRes.data.length : null,
          active: Array.isArray(activeRes.data) ? activeRes.data.length : null,
          dismissed: Array.isArray(dismissedRes.data) ? dismissedRes.data.length : null,
        });
      } catch (err) {
        if (handleAuthError(err)) return;
      }
    };

    refreshCounts();
  }, []);

  useEffect(() => {
    if (selected !== "Pending Applications" && selected !== "Declined Applications") {
      return;
    }

    setAppsStatus(selected === "Pending Applications" ? "pending" : "declined");

    const fetchApplications = async () => {
      try {
        setLoadingApps(true);
        setAppsError(null);
        const res = await axios.get(`${API_BASE}/api/applications/`, {
          headers: authHeaders(),
          params: { status: selected === "Pending Applications" ? "pending" : "declined" },
        });
        setApplications(res.data);
        setCounts((prev) => ({
          ...prev,
          [selected === "Pending Applications" ? "pending" : "declined"]: Array.isArray(res.data)
            ? res.data.length
            : prev[selected === "Pending Applications" ? "pending" : "declined"],
        }));
      } catch (err) {
        if (handleAuthError(err)) return;
        console.error("Error fetching applications", err);
        setAppsError("Could not load applications. Make sure the server is running.");
      } finally {
        setLoadingApps(false);
      }
    };

    fetchApplications();
  }, [selected]);

  useEffect(() => {
    if (selected !== "Learners / Interns" && selected !== "Dismissed") return;

    setLearnerStatus(selected === "Learners / Interns" ? "active" : "dismissed");

    const fetchLearners = async () => {
      try {
        setLoadingLearners(true);
        setLearnersError(null);
        const res = await axios.get(`${API_BASE}/api/learners/`, {
          headers: authHeaders(),
          params: { status: selected === "Learners / Interns" ? "active" : "dismissed" },
        });
        setLearners(res.data);
        setCounts((prev) => ({
          ...prev,
          [selected === "Learners / Interns" ? "active" : "dismissed"]: Array.isArray(res.data)
            ? res.data.length
            : prev[selected === "Learners / Interns" ? "active" : "dismissed"],
        }));
      } catch (err) {
        if (handleAuthError(err)) return;
        console.error("Error fetching learners", err);
        setLearnersError("Could not load learners.");
      } finally {
        setLoadingLearners(false);
      }
    };

    fetchLearners();
  }, [selected]);

  useEffect(() => {
    if (selected !== "Internships / Learnerships") return;

    const fetchOpps = async () => {
      try {
        setLoadingOpps(true);
        setOppsError(null);
        const res = await axios.get(`${API_BASE}/api/programs/`, {
          headers: authHeaders(),
        });
        setOpportunities(res.data);
      } catch (err) {
        if (handleAuthError(err)) return;
        console.error("Error fetching opportunities", err);
        setOppsError("Could not load opportunities.");
      } finally {
        setLoadingOpps(false);
      }
    };

    fetchOpps();
  }, [selected]);

  useEffect(() => {
    if (selected !== "Gallery") return;

    const fetchGallery = async () => {
      try {
        setLoadingGallery(true);
        setGalleryError(null);
        const res = await axios.get(`${API_BASE}/api/gallery/`, {
          headers: authHeaders(),
        });
        setGalleryPosts(res.data);
      } catch (err) {
        if (handleAuthError(err)) return;
        console.error("Error fetching gallery", err);
        setGalleryError("Could not load gallery posts.");
      } finally {
        setLoadingGallery(false);
      }
    };

    fetchGallery();
  }, [selected]);

  useEffect(() => {
    if (selected !== "Settings") return;

    const fetchProfile = async () => {
      try {
        setProfileError(null);
        const res = await axios.get(`${API_BASE}/api/company-profile/`);
        setCompanyProfileUrl(resolveFileUrl(res.data?.pdf) || null);
      } catch (err) {
        // 404 just means not uploaded yet; don't treat as hard error
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setCompanyProfileUrl(null);
          return;
        }
        console.error("Error fetching company profile", err);
        setProfileError("Could not load current company profile.");
      }
    };

    fetchProfile();
  }, [selected]);

  useEffect(() => {
    if (selected !== "Enquiries") return;

    const fetchEnquiries = async () => {
      try {
        setLoadingEnquiries(true);
        setEnquiriesError(null);
        const res = await axios.get(`${API_BASE}/api/enquiries/`, {
          headers: authHeaders(),
        });
        setEnquiries(res.data);
      } catch (err) {
        if (handleAuthError(err)) return;
        console.error("Error fetching enquiries", err);
        setEnquiriesError("Could not load enquiries.");
      } finally {
        setLoadingEnquiries(false);
      }
    };

    fetchEnquiries();
  }, [selected]);

  const renderContent = () => {
    switch (selected) {
      case "Pending Applications":
      case "Declined Applications":
        return (
          <ApplicationsSection
            selected={selected}
            applications={applications}
            loadingApps={loadingApps}
            appsError={appsError}
            appsStatus={appsStatus}
            applicationsFilter={applicationsFilter}
            setApplicationsFilter={setApplicationsFilter}
            searchId={searchId}
            setSearchId={setSearchId}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            applicationsSort={applicationsSort}
            setApplicationsSort={setApplicationsSort}
            setApplications={setApplications}
            setApplicationDetails={setApplicationDetails}
            openConfirm={openConfirm}
            notify={notify}
            API_BASE={API_BASE}
            authHeaders={authHeaders}
            handleAuthError={handleAuthError}
            resolveFileUrl={resolveFileUrl}
            statusChipColor={statusChipColor}
          />
        );
      case "Learners / Interns":
      case "Dismissed":
        return (
          <LearnersSection
            selected={selected}
            learners={learners}
            loadingLearners={loadingLearners}
            learnersError={learnersError}
            learnerStatus={learnerStatus}
            learnerTypeFilter={learnerTypeFilter}
            setLearnerTypeFilter={setLearnerTypeFilter}
            learnerProgramFilter={learnerProgramFilter}
            setLearnerProgramFilter={setLearnerProgramFilter}
            learnerSearch={learnerSearch}
            setLearnerSearch={setLearnerSearch}
            learnersSort={learnersSort}
            setLearnersSort={setLearnersSort}
            notify={notify}
            downloadLearnersCsv={downloadLearnersCsv}
            statusChipColor={statusChipColor}
            resolveFileUrl={resolveFileUrl}
            setLearnerDetails={setLearnerDetails}
            setLearners={setLearners}
            openConfirm={openConfirm}
            authHeaders={authHeaders}
            handleAuthError={handleAuthError}
          />
        );
      case "Legacy Learners":
        return null;
      case "Internships / Learnerships":
        return (
          <OpportunitiesSection
            loadingOpps={loadingOpps}
            oppsError={oppsError}
            opportunities={opportunities}
            newOppTitle={newOppTitle}
            setNewOppTitle={setNewOppTitle}
            newOppType={newOppType}
            setNewOppType={setNewOppType}
            newOppDescription={newOppDescription}
            setNewOppDescription={setNewOppDescription}
            setOpportunities={setOpportunities}
            notify={notify}
            openConfirm={openConfirm}
            authHeaders={authHeaders}
            handleAuthError={handleAuthError}
          />
        );
      case "Gallery":
        return (
          <GallerySection
            loadingGallery={loadingGallery}
            galleryError={galleryError}
            galleryPosts={galleryPosts}
            selectedGalleryPost={selectedGalleryPost}
            setSelectedGalleryPost={setSelectedGalleryPost}
            newGalleryCaption={newGalleryCaption}
            setNewGalleryCaption={setNewGalleryCaption}
            newGalleryBody={newGalleryBody}
            setNewGalleryBody={setNewGalleryBody}
            newGalleryImage={newGalleryImage}
            setNewGalleryImage={setNewGalleryImage}
            setGalleryPosts={setGalleryPosts}
            notify={notify}
            openConfirm={openConfirm}
            authHeaders={authHeaders}
            handleAuthError={handleAuthError}
            resolveFileUrl={resolveFileUrl}
          />
        );
      case "Settings":
        return (
          <SettingsSection
            companyProfileUrl={companyProfileUrl}
            setCompanyProfileUrl={setCompanyProfileUrl}
            uploadingProfile={uploadingProfile}
            setUploadingProfile={setUploadingProfile}
            profileError={profileError}
            setProfileError={setProfileError}
            notify={notify}
            authHeaders={authHeaders}
            resolveFileUrl={resolveFileUrl}
          />
        );
      case "Enquiries":
        return (
          <EnquiriesSection
            enquiries={enquiries}
            loadingEnquiries={loadingEnquiries}
            enquiriesError={enquiriesError}
          />
        );
      default:
        return null;
    }
  };

  const menuCountFor = (label: string) => {
    if (label === "Pending Applications") return counts.pending;
    if (label === "Declined Applications") return counts.declined;
    if (label === "Learners / Interns") return counts.active;
    if (label === "Dismissed") return counts.dismissed;
    return null;
  };

  const sidebarContent = (
    <Box>
      <Typography variant="h6" mb={0.5} fontWeight={800}>
        Admin Dashboard
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9 }}>
        Manage applications, learners, content
      </Typography>
      <Divider sx={{ mb: 2, bgcolor: "white" }} />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.label}
            selected={selected === item.label}
            onClick={() => {
              setSelected(item.label);
              if (!isDesktop) setMobileOpen(false);
            }}
            sx={{
              "&.Mui-selected": {
                bgcolor: "rgba(255,255,255,0.25)",
                borderRadius: 1,
                borderLeft: "4px solid #ffffff",
              },
              mb: 0.5,
            }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: "inherit" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" sx={{ color: "inherit" }}>
                    {item.label}
                  </Typography>
                  {menuCountFor(item.label) !== null && (
                    <Tooltip title="Items">
                      <Chip
                        size="small"
                        label={menuCountFor(item.label)}
                        sx={{
                          bgcolor: "rgba(255,255,255,0.25)",
                          color: "white",
                          fontWeight: 700,
                        }}
                      />
                    </Tooltip>
                  )}
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
      <Button
        variant="outlined"
        sx={{ mt: 2, borderColor: "white", color: "white" }}
        onClick={() => {
          handleLogout();
          if (!isDesktop) setMobileOpen(false);
        }}
      >
        Logout
      </Button>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f6f8" }}>
      {!isDesktop && (
        <AppBar position="fixed" sx={{ bgcolor: "#ff8800" }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={800}>
              Admin Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {isDesktop ? (
        <Paper
          sx={{
            width: 230,
            p: 2,
            borderRadius: 0,
            bgcolor: "#ff8800",
            color: "white",
            boxShadow: 4,
          }}
        >
          {sidebarContent}
        </Paper>
      ) : (
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: { width: 260, bgcolor: "#ff8800", color: "white", p: 2 },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3, pt: !isDesktop ? 10 : 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ mb: 2, alignItems: { sm: "center" }, justifyContent: "space-between" }}
        >
          <Typography variant="h5" fontWeight={800}>
            {selected}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {counts.pending !== null && (
              <Chip size="small" label={`Pending: ${counts.pending}`} />
            )}
            {counts.declined !== null && (
              <Chip size="small" label={`Declined: ${counts.declined}`} />
            )}
            {counts.active !== null && (
              <Chip size="small" label={`Active: ${counts.active}`} />
            )}
            {counts.dismissed !== null && (
              <Chip size="small" label={`Dismissed: ${counts.dismissed}`} />
            )}
          </Box>
        </Stack>
        <motion.div
          key={selected}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}

          <Dialog
            open={Boolean(applicationDetails)}
            onClose={() => setApplicationDetails(null)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>Application Details</DialogTitle>
            <DialogContent>
              {applicationDetails && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography>
                    <strong>Name:</strong> {applicationDetails.title} {applicationDetails.first_name}{" "}
                    {applicationDetails.middle_name} {applicationDetails.last_name}
                  </Typography>
                  <Typography>
                    <strong>ID Number:</strong> {applicationDetails.id_number || "-"}
                  </Typography>
                  <Typography>
                    <strong>Phone:</strong> {applicationDetails.phone || "-"}
                  </Typography>
                  <Typography>
                    <strong>Type:</strong> {applicationDetails.opportunity_type || "-"}
                  </Typography>
                  <Typography>
                    <strong>Program:</strong> {applicationDetails.opportunity_title || "-"}
                  </Typography>
                  <Typography>
                    <strong>Province:</strong> {applicationDetails.province || "-"}
                  </Typography>
                  <Typography>
                    <strong>Created:</strong>{" "}
                    {applicationDetails.created_at
                      ? new Date(applicationDetails.created_at).toLocaleString()
                      : "-"}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                    {applicationDetails.id_file && (
                      <Button
                        size="small"
                        variant="outlined"
                        href={resolveFileUrl(applicationDetails.id_file) || undefined}
                        target="_blank"
                      >
                        Open ID
                      </Button>
                    )}
                    {applicationDetails.qualification_file && (
                      <Button
                        size="small"
                        variant="outlined"
                        href={resolveFileUrl(applicationDetails.qualification_file) || undefined}
                        target="_blank"
                      >
                        Open Qualification
                      </Button>
                    )}
                    {applicationDetails.other_file && (
                      <Button
                        size="small"
                        variant="outlined"
                        href={resolveFileUrl(applicationDetails.other_file) || undefined}
                        target="_blank"
                      >
                        Open Other
                      </Button>
                    )}
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setApplicationDetails(null)}>Close</Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={Boolean(learnerDetails)}
            onClose={() => setLearnerDetails(null)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>Learner / Intern Details</DialogTitle>
            <DialogContent>
              {learnerDetails && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography>
                    <strong>Name:</strong> {learnerDetails.title} {learnerDetails.first_name}{" "}
                    {learnerDetails.middle_name} {learnerDetails.last_name}
                  </Typography>
                  <Typography>
                    <strong>ID Number:</strong> {learnerDetails.id_number || "-"}
                  </Typography>
                  <Typography>
                    <strong>Phone:</strong> {learnerDetails.phone || "-"}
                  </Typography>
                  <Typography>
                    <strong>Status:</strong> {learnerDetails.status}
                  </Typography>
                  <Typography>
                    <strong>Type:</strong> {learnerDetails.opportunity_type || "-"}
                  </Typography>
                  <Typography>
                    <strong>Program:</strong> {learnerDetails.opportunity_title || "-"}
                  </Typography>
                  <Typography>
                    <strong>Province:</strong> {learnerDetails.province || "-"}
                  </Typography>
                  <Typography>
                    <strong>Created:</strong>{" "}
                    {learnerDetails.created_at
                      ? new Date(learnerDetails.created_at).toLocaleString()
                      : "-"}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                    {learnerDetails.id_file && (
                      <Button
                        size="small"
                        variant="outlined"
                        href={resolveFileUrl(learnerDetails.id_file) || undefined}
                        target="_blank"
                      >
                        Open ID
                      </Button>
                    )}
                    {learnerDetails.qualification_file && (
                      <Button
                        size="small"
                        variant="outlined"
                        href={resolveFileUrl(learnerDetails.qualification_file) || undefined}
                        target="_blank"
                      >
                        Open Qualification
                      </Button>
                    )}
                    {learnerDetails.other_file && (
                      <Button
                        size="small"
                        variant="outlined"
                        href={resolveFileUrl(learnerDetails.other_file) || undefined}
                        target="_blank"
                      >
                        Open Other
                      </Button>
                    )}
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setLearnerDetails(null)}>Close</Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            maxWidth="xs"
            fullWidth
          >
            <DialogTitle>{confirmTitle}</DialogTitle>
            <DialogContent>
              <Typography>{confirmMessage}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
              <Button
                color="error"
                onClick={() => {
                  const action = confirmAction;
                  setConfirmOpen(false);
                  if (action) {
                    action();
                  }
                }}
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3500}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity={snackbarSeverity}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </motion.div>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
