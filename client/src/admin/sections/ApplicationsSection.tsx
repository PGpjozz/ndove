import React from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import axios from "axios";

type Props = {
  selected:
    | "Pending Applications"
    | "Declined Applications";

  applications: any[];
  loadingApps: boolean;
  appsError: string | null;
  appsStatus: "pending" | "approved" | "declined";

  applicationsFilter: "all" | "internship" | "learnership";
  setApplicationsFilter: (v: "all" | "internship" | "learnership") => void;

  searchId: string;
  setSearchId: (v: string) => void;

  fromDate: string;
  setFromDate: (v: string) => void;

  toDate: string;
  setToDate: (v: string) => void;

  applicationsSort: "newest" | "oldest" | "name";
  setApplicationsSort: (v: "newest" | "oldest" | "name") => void;

  setApplications: React.Dispatch<React.SetStateAction<any[]>>;
  setApplicationDetails: (app: any) => void;

  openConfirm: (
    title: string,
    message: string,
    action: () => void
  ) => void;
  notify: (
    message: string,
    severity?: "success" | "info" | "warning" | "error"
  ) => void;

  API_BASE: string;
  authHeaders: () => Record<string, string>;
  handleAuthError: (err: any) => boolean;
  resolveFileUrl: (path?: string | null) => string | null;
  statusChipColor: (status: string) => string;
};

const ApplicationsSection: React.FC<Props> = ({
  selected,
  applications,
  loadingApps,
  appsError,
  appsStatus,
  applicationsFilter,
  setApplicationsFilter,
  searchId,
  setSearchId,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  applicationsSort,
  setApplicationsSort,
  setApplications,
  setApplicationDetails,
  openConfirm,
  notify,
  API_BASE,
  authHeaders,
  handleAuthError,
  resolveFileUrl,
  statusChipColor,
}) => {
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
            setApplicationsSort(e.target.value as "newest" | "oldest" | "name")
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

      {!loadingApps && !appsError && applications.length > 0 &&
        (() => {
          const filtered = applications
            .filter((app) => {
              if (applicationsFilter === "all" || !app.opportunity_type) {
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
                const nameA = `${a.first_name || ""} ${a.last_name || ""}`
                  .toLowerCase();
                const nameB = `${b.first_name || ""} ${b.last_name || ""}`
                  .toLowerCase();
                return nameA.localeCompare(nameB);
              }
              const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
              const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
              return applicationsSort === "newest" ? dateB - dateA : dateA - dateB;
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
                              href={
                                resolveFileUrl(app.qualification_file) || undefined
                              }
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
                                        console.error(
                                          "Error approving application",
                                          err
                                        );
                                        notify(
                                          "Could not approve application.",
                                          "error"
                                        );
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
                                        console.error(
                                          "Error declining application",
                                          err
                                        );
                                        notify(
                                          "Could not decline application.",
                                          "error"
                                        );
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
                                        console.error(
                                          "Error approving declined application",
                                          err
                                        );
                                        notify(
                                          "Could not approve application.",
                                          "error"
                                        );
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
                                        console.error(
                                          "Error deleting application",
                                          err
                                        );
                                        notify(
                                          "Could not delete application.",
                                          "error"
                                        );
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
        })()}
    </Paper>
  );
};

export default ApplicationsSection;
