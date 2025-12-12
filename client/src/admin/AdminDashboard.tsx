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
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h5" fontWeight={600}>
                {selected === "Pending Applications"
                  ? "Pending Applications"
                  : "Declined Applications"}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FilterListIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Filters & search
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mb: 2,
                flexWrap: "wrap",
                p: 1.5,
                borderRadius: 1,
                bgcolor: "#fafafa",
              }}
            >
              <Button
                size="small"
                variant={applicationsFilter === "all" ? "contained" : "outlined"}
                onClick={() => setApplicationsFilter("all")}
              >
                All
              </Button>
              <Button
                size="small"
                variant={
                  applicationsFilter === "internship" ? "contained" : "outlined"
                }
                onClick={() => setApplicationsFilter("internship")}
              >
                Internships
              </Button>
              <Button
                size="small"
                variant={
                  applicationsFilter === "learnership" ? "contained" : "outlined"
                }
                onClick={() => setApplicationsFilter("learnership")}
              >
                Learnerships
              </Button>
              <Button
                size="small"
                variant={applicationsFilter === "all" ? "contained" : "outlined"}
                onClick={() => setApplicationsFilter("all")}
                sx={{ display: "none" }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1.5,
                mb: 2,
                p: 1.5,
                borderRadius: 1,
                bgcolor: "#fafafa",
              }}
            >
              <TextField
                label="Search by ID number"
                size="small"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              <TextField
                label="From date"
                type="date"
                size="small"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="To date"
                type="date"
                size="small"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                select
                size="small"
                label="Sort by"
                value={applicationsSort}
                onChange={(e) =>
                  setApplicationsSort(e.target.value as
                    | "newest"
                    | "oldest"
                    | "name")
                }
              >
                <MenuItem value="newest">Newest first</MenuItem>
                <MenuItem value="oldest">Oldest first</MenuItem>
                <MenuItem value="name">Name A-Z</MenuItem>
              </TextField>
            </Box>
            {loadingApps && (
              <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            )}
            {appsError && (
              <Typography color="error" mb={2}>
                {appsError}
              </Typography>
            )}
            {!loadingApps && !appsError && applications.length === 0 && (
              <Typography>
                {selected === "Pending Applications"
                  ? "No pending applications yet."
                  : "No declined applications yet."}
              </Typography>
            )}
            {!loadingApps && !appsError && applications.length > 0 && (
              (() => {
                const filtered = applications
                  .filter((app) => {
                    if (
                      applicationsFilter === "all" ||
                      !app.opportunity_type
                    ) {
                      return true;
                    }
                    return app.opportunity_type === applicationsFilter;
                  })
                  .filter((app) => {
                    if (!searchId.trim()) return true;
                    return String(app.id_number || "")
                      .toLowerCase()
                      .includes(searchId.toLowerCase());
                  })
                  .filter((app) => {
                    if (!fromDate && !toDate) return true;
                    if (!app.created_at) return false;
                    const d = new Date(app.created_at);
                    const day = d.toISOString().slice(0, 10);
                    if (fromDate && day < fromDate) return false;
                    if (toDate && day > toDate) return false;
                    return true;
                  })
                  .slice()
                  .sort((a, b) => {
                    if (applicationsSort === "name") {
                      const nameA = `${a.first_name || ""} ${
                        a.last_name || ""
                      }`.toLowerCase();
                      const nameB = `${b.first_name || ""} ${
                        b.last_name || ""
                      }`.toLowerCase();
                      return nameA.localeCompare(nameB);
                    }
                    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                    return applicationsSort === "newest"
                      ? dateB - dateA
                      : dateA - dateB;
                  });
                if (filtered.length === 0) {
                  return (
                    <Typography>
                      No applications for {applicationsFilter} yet.
                    </Typography>
                  );
                }
                return (
                  <Box sx={{ overflowX: "auto" }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>ID Number</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Created At</TableCell>
                          <TableCell>Files</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filtered.map((app) => (
                          <TableRow key={app.id} hover>
                            <TableCell>
                              {app.title} {app.first_name} {app.last_name}
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {app.opportunity_type || "-"}
                              </Typography>
                              {app.opportunity_title && (
                                <Typography variant="caption" display="block">
                                  {app.opportunity_title}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>{app.id_number}</TableCell>
                            <TableCell>
                              <Chip
                                size="small"
                                label={appsStatus}
                                color={statusChipColor(appsStatus) as any}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              {app.created_at
                                ? new Date(app.created_at).toLocaleString()
                                : "-"}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {app.id_file && (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    href={resolveFileUrl(app.id_file) || undefined}
                                    target="_blank"
                                  >
                                    ID
                                  </Button>
                                )}
                                {app.qualification_file && (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    href={resolveFileUrl(app.qualification_file) || undefined}
                                    target="_blank"
                                  >
                                    Qualification
                                  </Button>
                                )}
                                {app.other_file && (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    href={resolveFileUrl(app.other_file) || undefined}
                                    target="_blank"
                                  >
                                    Other
                                  </Button>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                <Button
                                  size="small"
                                  variant="text"
                                  onClick={() => setApplicationDetails(app)}
                                >
                                  View
                                </Button>
                                {appsStatus === "pending" && (
                                  <>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      onClick={() =>
                                        openConfirm(
                                          "Approve application",
                                          "Approve this application and create a learner/intern record?",
                                          async () => {
                                            try {
                                              await axios.post(
                                                `${API_BASE}/api/applications/${app.id}/approve/`,
                                                {},
                                                { headers: authHeaders() }
                                              );
                                              setApplications((prev) =>
                                                prev.filter((a) => a.id !== app.id)
                                              );
                                            } catch (err) {
                                              if (handleAuthError(err)) return;
                                              console.error("Error approving application", err);
                                              notify("Could not approve application.", "error");
                                            }
                                          }
                                        )
                                      }
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      size="small"
                                      color="error"
                                      variant="outlined"
                                      onClick={() =>
                                        openConfirm(
                                          "Decline application",
                                          "Decline this application?",
                                          async () => {
                                            try {
                                              await axios.post(
                                                `${API_BASE}/api/applications/${app.id}/decline/`,
                                                {},
                                                { headers: authHeaders() }
                                              );
                                              setApplications((prev) =>
                                                prev.filter((a) => a.id !== app.id)
                                              );
                                            } catch (err) {
                                              if (handleAuthError(err)) return;
                                              console.error("Error declining application", err);
                                              notify("Could not decline application.", "error");
                                            }
                                          }
                                        )
                                      }
                                    >
                                      Decline
                                    </Button>
                                  </>
                                )}
                                {appsStatus === "declined" && (
                                  <>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      onClick={() =>
                                        openConfirm(
                                          "Approve application",
                                          "Approve this declined application and create a learner/intern record?",
                                          async () => {
                                            try {
                                              await axios.post(
                                                `${API_BASE}/api/applications/${app.id}/approve/`,
                                                {},
                                                { headers: authHeaders() }
                                              );
                                              setApplications((prev) =>
                                                prev.filter((a) => a.id !== app.id)
                                              );
                                            } catch (err) {
                                              if (handleAuthError(err)) return;
                                              console.error("Error approving declined application", err);
                                              notify("Could not approve application.", "error");
                                            }
                                          }
                                        )
                                      }
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      size="small"
                                      color="error"
                                      variant="outlined"
                                      onClick={() =>
                                        openConfirm(
                                          "Delete application",
                                          "Permanently delete this declined application?",
                                          async () => {
                                            try {
                                              await axios.delete(
                                                `${API_BASE}/api/applications/${app.id}/`,
                                                { headers: authHeaders() }
                                              );
                                              setApplications((prev) =>
                                                prev.filter((a) => a.id !== app.id)
                                              );
                                            } catch (err) {
                                              if (handleAuthError(err)) return;
                                              console.error("Error deleting application", err);
                                              notify("Could not delete application.", "error");
                                            }
                                          }
                                        )
                                      }
                                    >
                                      Delete
                                    </Button>
                                  </>
                                )}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                );
              })()
            )}
          </Paper>
        );
      case "Learners / Interns":
      case "Dismissed":
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight={600} mb={2}>
              {selected === "Learners / Interns"
                ? "Approved Learners / Interns"
                : "Dismissed Learners / Interns"}
            </Typography>
            {selected === "Learners / Interns" && (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1.5,
                  mb: 2,
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: "#fafafa",
                  alignItems: "center",
                }}
              >
                <TextField
                  select
                  size="small"
                  label="Type"
                  value={learnerTypeFilter}
                  onChange={(e) =>
                    setLearnerTypeFilter(
                      e.target.value as "all" | "internship" | "learnership"
                    )
                  }
                  sx={{ minWidth: 160 }}
                >
                  <MenuItem value="all">All types</MenuItem>
                  <MenuItem value="internship">Internship</MenuItem>
                  <MenuItem value="learnership">Learnership</MenuItem>
                </TextField>

                <TextField
                  select
                  size="small"
                  label="Program"
                  value={learnerProgramFilter}
                  onChange={(e) => setLearnerProgramFilter(e.target.value)}
                  sx={{ minWidth: 220 }}
                >
                  <MenuItem value="all">All programs</MenuItem>
                  {Array.from(
                    new Set(
                      learners
                        .map((l) => l.opportunity_title)
                        .filter((t: string | null | undefined) => t)
                    )
                  )
                    .sort((a: any, b: any) => String(a).localeCompare(String(b)))
                    .map((title: any) => (
                      <MenuItem key={title} value={title}>
                        {title}
                      </MenuItem>
                    ))}
                </TextField>

                <TextField
                  size="small"
                  label="Search name or ID"
                  value={learnerSearch}
                  onChange={(e) => setLearnerSearch(e.target.value)}
                />

                <TextField
                  select
                  size="small"
                  label="Sort"
                  value={learnersSort}
                  onChange={(e) =>
                    setLearnersSort(e.target.value as "newest" | "oldest" | "name")
                  }
                  sx={{ minWidth: 160 }}
                >
                  <MenuItem value="newest">Newest first</MenuItem>
                  <MenuItem value="oldest">Oldest first</MenuItem>
                  <MenuItem value="name">Name A-Z</MenuItem>
                </TextField>

                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    const filtered = learners
                      .filter((l) => {
                        if (learnerTypeFilter === "all") return true;
                        return l.opportunity_type === learnerTypeFilter;
                      })
                      .filter((l) => {
                        if (learnerProgramFilter === "all") return true;
                        return l.opportunity_title === learnerProgramFilter;
                      })
                      .filter((l) => {
                        const term = learnerSearch.trim().toLowerCase();
                        if (!term) return true;
                        const full = `${l.first_name || ""} ${l.middle_name || ""} ${
                          l.last_name || ""
                        }`.toLowerCase();
                        return (
                          full.includes(term) ||
                          String(l.id_number || "").toLowerCase().includes(term)
                        );
                      })
                      .slice()
                      .sort((a, b) => {
                        if (learnersSort === "name") {
                          const nameA = `${a.first_name || ""} ${a.last_name || ""}`
                            .trim()
                            .toLowerCase();
                          const nameB = `${b.first_name || ""} ${b.last_name || ""}`
                            .trim()
                            .toLowerCase();
                          return nameA.localeCompare(nameB);
                        }
                        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                        return learnersSort === "newest" ? dateB - dateA : dateA - dateB;
                      });

                    if (filtered.length === 0) {
                      notify("No learners match the current filters.", "warning");
                      return;
                    }
                    downloadLearnersCsv(filtered);
                    notify(`Downloaded CSV (${filtered.length} rows).`, "success");
                  }}
                >
                  Download CSV
                </Button>
              </Box>
            )}
            {loadingLearners && (
              <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            )}
            {learnersError && (
              <Typography color="error" mb={2}>
                {learnersError}
              </Typography>
            )}
            {!loadingLearners && !learnersError && learners.length === 0 && (
              <Typography>
                {selected === "Learners / Interns"
                  ? "No approved learners/interns yet."
                  : "No dismissed learners/interns yet."}
              </Typography>
            )}
            {!loadingLearners && !learnersError && learners.length > 0 && (
              (() => {
                const filtered = learners
                  .filter((l) => {
                    if (selected !== "Learners / Interns") return true;
                    if (learnerTypeFilter === "all") return true;
                    return l.opportunity_type === learnerTypeFilter;
                  })
                  .filter((l) => {
                    if (selected !== "Learners / Interns") return true;
                    if (learnerProgramFilter === "all") return true;
                    return l.opportunity_title === learnerProgramFilter;
                  })
                  .filter((l) => {
                    if (selected !== "Learners / Interns") return true;
                    const term = learnerSearch.trim().toLowerCase();
                    if (!term) return true;
                    const full = `${l.first_name || ""} ${l.middle_name || ""} ${
                      l.last_name || ""
                    }`.toLowerCase();
                    return (
                      full.includes(term) ||
                      String(l.id_number || "").toLowerCase().includes(term)
                    );
                  })
                  .slice()
                  .sort((a, b) => {
                    if (selected !== "Learners / Interns") {
                      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                      return dateB - dateA;
                    }
                    if (learnersSort === "name") {
                      const nameA = `${a.first_name || ""} ${a.last_name || ""}`
                        .trim()
                        .toLowerCase();
                      const nameB = `${b.first_name || ""} ${b.last_name || ""}`
                        .trim()
                        .toLowerCase();
                      return nameA.localeCompare(nameB);
                    }
                    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                    return learnersSort === "newest" ? dateB - dateA : dateA - dateB;
                  });

                if (filtered.length === 0) {
                  return (
                    <Typography>
                      {selected === "Learners / Interns"
                        ? "No learners match the current filters."
                        : "No learners found."}
                    </Typography>
                  );
                }

                return (
                  <Box sx={{ overflowX: "auto" }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>ID Number</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Created At</TableCell>
                          <TableCell>Files</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filtered.map((learner) => (
                          <TableRow key={learner.id} hover>
                            <TableCell>
                              {learner.title} {learner.first_name} {learner.last_name}
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {learner.opportunity_type || "-"}
                              </Typography>
                              {learner.opportunity_title && (
                                <Typography variant="caption" display="block">
                                  {learner.opportunity_title}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>{learner.id_number}</TableCell>
                            <TableCell>
                              <Chip
                                size="small"
                                label={learner.status}
                                color={statusChipColor(learner.status) as any}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              {learner.created_at
                                ? new Date(learner.created_at).toLocaleString()
                                : "-"}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {learner.id_file && (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    href={resolveFileUrl(learner.id_file) || undefined}
                                    target="_blank"
                                  >
                                    ID
                                  </Button>
                                )}
                                {learner.qualification_file && (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    href={
                                      resolveFileUrl(learner.qualification_file) ||
                                      undefined
                                    }
                                    target="_blank"
                                  >
                                    Qualification
                                  </Button>
                                )}
                                {learner.other_file && (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    href={resolveFileUrl(learner.other_file) || undefined}
                                    target="_blank"
                                  >
                                    Other
                                  </Button>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                <Button
                                  size="small"
                                  variant="text"
                                  onClick={() => setLearnerDetails(learner)}
                                >
                                  View
                                </Button>
                                {learnerStatus === "active" && (
                                  <Button
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    onClick={() =>
                                      openConfirm(
                                        "Dismiss learner",
                                        "Dismiss this learner/intern (move to dismissed list)?",
                                        async () => {
                                          try {
                                            await axios.post(
                                              `${API_BASE}/api/learners/${learner.id}/dismiss/`,
                                              {},
                                              { headers: authHeaders() }
                                            );
                                            setLearners((prev) =>
                                              prev.filter((l) => l.id !== learner.id)
                                            );
                                          } catch (err) {
                                            if (handleAuthError(err)) return;
                                            console.error(
                                              "Error dismissing learner",
                                              err
                                            );
                                            notify("Could not dismiss learner.", "error");
                                          }
                                        }
                                      )
                                    }
                                  >
                                    Dismiss
                                  </Button>
                                )}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                );
              })()
            )}
          </Paper>
        );
      case "Legacy Learners":
        return null;
      case "Internships / Learnerships":
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" mb={2}>
              Post Internships / Learnerships
            </Typography>
            {loadingOpps && <Typography>Loading opportunities...</Typography>}
            {oppsError && (
              <Typography color="error" mb={2}>
                {oppsError}
              </Typography>
            )}
            <Box
              component="form"
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const res = await axios.post(
                    `${API_BASE}/api/programs/`,
                    {
                      title: newOppTitle,
                      type: newOppType,
                      description: newOppDescription,
                      is_active: true,
                    },
                    { headers: authHeaders() }
                  );
                  setOpportunities((prev) => [res.data, ...prev]);
                  setNewOppTitle("");
                  setNewOppType("internship");
                  setNewOppDescription("");
                } catch (err) {
                  if (handleAuthError(err)) return;
                  console.error("Error creating opportunity", err);
                  notify("Could not create opportunity.", "error");
                }
              }}
              sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1.5 }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                Add New Opportunity
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                  <input
                    type="text"
                    placeholder="Title"
                    value={newOppTitle}
                    onChange={(e) => setNewOppTitle(e.target.value)}
                    style={{
                      width: "100%",
                      padding: 8,
                      borderRadius: 4,
                      border: "1px solid #ccc",
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <select
                    value={newOppType}
                    onChange={(e) => setNewOppType(e.target.value)}
                    style={{
                      width: "100%",
                      padding: 8,
                      borderRadius: 4,
                      border: "1px solid #ccc",
                    }}
                  >
                    <option value="internship">Internship</option>
                    <option value="learnership">Learnership</option>
                  </select>
                </Grid>
              </Grid>
              <textarea
                placeholder="Description"
                value={newOppDescription}
                onChange={(e) => setNewOppDescription(e.target.value)}
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  minHeight: 80,
                }}
                required
              />
              <Button type="submit" variant="contained" color="primary">
                Save Opportunity
              </Button>
            </Box>
            {!loadingOpps && !oppsError && opportunities.length === 0 && (
              <Typography sx={{ mt: 2 }}>No opportunities yet.</Typography>
            )}
            {!loadingOpps && !oppsError && opportunities.length > 0 && (
              <Box sx={{ mt: 3 }}>
                {opportunities.map((opp) => (
                  <Box
                    key={opp.id}
                    sx={{ borderBottom: "1px solid #eee", py: 1, mb: 1 }}
                  >
                    <Typography fontWeight={600}>{opp.title}</Typography>
                    <Typography variant="body2">Type: {opp.type}</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {opp.description}
                    </Typography>
                    <Button
                      size="small"
                      color="error"
                      onClick={() =>
                        openConfirm(
                          "Delete opportunity",
                          "Are you sure you want to delete this opportunity?",
                          async () => {
                            try {
                              await axios.delete(
                                `${API_BASE}/api/programs/${opp.id}/`,
                                { headers: authHeaders() }
                              );
                              setOpportunities((prev) =>
                                prev.filter((o) => o.id !== opp.id)
                              );
                            } catch (err) {
                              if (handleAuthError(err)) return;
                              console.error("Error deleting opportunity", err);
                              notify("Could not delete opportunity.", "error");
                            }
                          }
                        )
                      }
                    >
                      Delete
                    </Button>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        );
      case "Gallery":
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" mb={2}>
              Gallery Posts
            </Typography>
            {loadingGallery && (
              <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            )}
            {galleryError && (
              <Typography color="error" mb={2}>
                {galleryError}
              </Typography>
            )}
            <Dialog
              open={Boolean(selectedGalleryPost)}
              onClose={() => setSelectedGalleryPost(null)}
              maxWidth="sm"
              fullWidth
            >
              {selectedGalleryPost && (
                <>
                  <DialogTitle>
                    {selectedGalleryPost.title || selectedGalleryPost.caption || "Gallery"}
                  </DialogTitle>
                  <DialogContent>
                    {selectedGalleryPost.image && (
                      <Box
                        sx={{
                          mb: 2,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={resolveFileUrl(selectedGalleryPost.image) || undefined}
                          alt={
                            selectedGalleryPost.title ||
                            selectedGalleryPost.caption ||
                            "Gallery image"
                          }
                          style={{ maxWidth: "100%", borderRadius: 4 }}
                        />
                      </Box>
                    )}
                    {selectedGalleryPost.created_at && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mb: 1 }}
                      >
                        {new Date(selectedGalleryPost.created_at).toLocaleString()}
                      </Typography>
                    )}
                    {selectedGalleryPost.caption && (
                      <Typography variant="body2">{selectedGalleryPost.caption}</Typography>
                    )}
                  </DialogContent>
                </>
              )}
            </Dialog>
            <Box
              component="form"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newGalleryImage) {
                  notify("Please choose an image.", "warning");
                  return;
                }
                const formData = new FormData();
                formData.append("title", newGalleryCaption);
                formData.append("caption", newGalleryBody);
                formData.append("image", newGalleryImage);
                try {
                  const res = await axios.post(
                    `${API_BASE}/api/gallery/`,
                    formData,
                    {
                      headers: {
                        ...authHeaders(),
                        "Content-Type": "multipart/form-data",
                      },
                    }
                  );
                  setGalleryPosts((prev) => [res.data, ...prev]);
                  setNewGalleryCaption("");
                  setNewGalleryBody("");
                  setNewGalleryImage(null);
                  notify("Gallery post saved.", "success");
                } catch (err) {
                  console.error("Error creating gallery post", err);
                  notify("Could not create gallery post.", "error");
                }
              }}
              sx={{ mb: 3, display: "flex", flexDirection: "column", gap: 1.5 }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                Add New Gallery Post
              </Typography>
              <TextField
                label="Title"
                size="small"
                value={newGalleryCaption}
                onChange={(e) => setNewGalleryCaption(e.target.value)}
                required
              />
              <TextField
                label="Caption"
                size="small"
                value={newGalleryBody}
                onChange={(e) => setNewGalleryBody(e.target.value)}
                multiline
                minRows={3}
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setNewGalleryImage(file);
                }}
                required
              />
              <Button type="submit" variant="contained" color="primary">
                Save Gallery Post
              </Button>
            </Box>
            {!loadingGallery && !galleryError && galleryPosts.length === 0 && (
              <Typography>No gallery posts yet.</Typography>
            )}
            {!loadingGallery && !galleryError && galleryPosts.length > 0 && (
              <Grid container spacing={2}>
                {galleryPosts.map((post) => (
                  <Grid item xs={12} sm={6} md={4} key={post.id}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, borderRadius: 2, height: "100%" }}
                    >
                      {post.image && (
                        <Box
                          sx={{
                            mb: 1.5,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <img
                            src={resolveFileUrl(post.image) || undefined}
                            alt={post.title || post.caption || "Gallery image"}
                            style={{
                              maxWidth: "100%",
                              maxHeight: 160,
                              objectFit: "cover",
                              borderRadius: 4,
                            }}
                          />
                        </Box>
                      )}
                      <Typography fontWeight={600} sx={{ mb: 0.5 }}>
                        {post.title || post.caption}
                      </Typography>
                      {post.created_at && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mb: 1 }}
                        >
                          {new Date(post.created_at).toLocaleString()}
                        </Typography>
                      )}
                      <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                        <Button size="small" variant="text" onClick={() => setSelectedGalleryPost(post)}>
                          View
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() =>
                            openConfirm(
                              "Delete gallery post",
                              "Are you sure you want to delete this gallery post?",
                              async () => {
                                try {
                                  await axios.delete(
                                    `${API_BASE}/api/gallery/${post.id}/`,
                                    { headers: authHeaders() }
                                  );
                                  setGalleryPosts((prev) =>
                                    prev.filter((p) => p.id !== post.id)
                                  );
                                  notify("Gallery post deleted successfully", "success");
                                } catch (err) {
                                  if (handleAuthError(err)) return;
                                  console.error(
                                    "Error deleting gallery post",
                                    err
                                  );
                                  notify("Could not delete gallery post.", "error");
                                }
                              }
                            )
                          }
                        >
                          Delete
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        );
      case "Settings":
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" mb={2}>
              Admin Settings
            </Typography>
            <Typography sx={{ mb: 2 }}>
              Upload the latest company profile PDF used on the public About
              page.
            </Typography>
            {profileError && (
              <Typography color="error" sx={{ mb: 2 }}>
                {profileError}
              </Typography>
            )}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                Current file
              </Typography>
              {companyProfileUrl ? (
                <Button
                  variant="outlined"
                  href={companyProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                >
                  Open current profile
                </Button>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No company profile uploaded yet.
                </Typography>
              )}
            </Box>
            <Box
              component="form"
              onSubmit={async (e) => {
                e.preventDefault();
                const input =
                  (e.currentTarget.elements.namedItem(
                    "companyProfile"
                  ) as HTMLInputElement) || null;
                const file = input?.files?.[0];
                if (!file) {
                  notify("Please choose a PDF file.", "warning");
                  return;
                }
                const formData = new FormData();
                formData.append("pdf", file);
                try {
                  setUploadingProfile(true);
                  setProfileError(null);
                  const res = await axios.post(
                    `${API_BASE}/api/company-profile/`,
                    formData,
                    {
                      headers: {
                        ...authHeaders(),
                        "Content-Type": "multipart/form-data",
                      },
                    }
                  );
                  setCompanyProfileUrl(resolveFileUrl(res.data?.pdf) || null);
                  if (input) {
                    input.value = "";
                  }
                } catch (err) {
                  console.error("Error uploading company profile", err);
                  setProfileError("Could not upload company profile.");
                } finally {
                  setUploadingProfile(false);
                }
              }}
              sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                Upload new profile
              </Typography>
              <input
                type="file"
                name="companyProfile"
                accept="application/pdf"
                style={{ color: "#fff" }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={uploadingProfile}
              >
                {uploadingProfile ? "Uploading..." : "Save Company Profile"}
              </Button>
            </Box>
          </Paper>
        );
      case "Enquiries":
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" mb={2}>
              Enquiries
            </Typography>
            {loadingEnquiries && <Typography>Loading enquiries...</Typography>}
            {enquiriesError && (
              <Typography color="error" mb={2}>
                {enquiriesError}
              </Typography>
            )}
            {!loadingEnquiries && !enquiriesError && enquiries.length === 0 && (
              <Typography>No enquiries yet.</Typography>
            )}
            {!loadingEnquiries && !enquiriesError && enquiries.length > 0 && (
              <Box sx={{ overflowX: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Full name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Message</TableCell>
                      <TableCell>Created</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {enquiries.map((e) => (
                      <TableRow key={e.id} hover>
                        <TableCell>{e.full_name}</TableCell>
                        <TableCell>{e.email}</TableCell>
                        <TableCell>{e.phone || "-"}</TableCell>
                        <TableCell>{e.message}</TableCell>
                        <TableCell>
                          {e.created_at ? new Date(e.created_at).toLocaleString() : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </Paper>
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
