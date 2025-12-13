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
import axios from "axios";
import API_BASE from "../../apiConfig";

type LearnersSectionProps = {
  selected: string;
  learners: any[];
  loadingLearners: boolean;
  learnersError: string | null;
  learnerStatus: "active" | "dismissed";

  learnerTypeFilter: "all" | "internship" | "learnership";
  setLearnerTypeFilter: (v: "all" | "internship" | "learnership") => void;
  learnerProgramFilter: string;
  setLearnerProgramFilter: (v: string) => void;
  learnerSearch: string;
  setLearnerSearch: (v: string) => void;
  learnersSort: "newest" | "oldest" | "name";
  setLearnersSort: (v: "newest" | "oldest" | "name") => void;

  notify: (message: string, severity?: "success" | "info" | "warning" | "error") => void;
  downloadLearnersCsv: (rows: any[]) => void;
  statusChipColor: (status?: string) => string;
  resolveFileUrl: (path?: string | null) => string | null;

  setLearnerDetails: (learner: any | null) => void;
  setLearners: React.Dispatch<React.SetStateAction<any[]>>;

  openConfirm: (title: string, message: string, action: () => void) => void;
  authHeaders: () => Record<string, string>;
  handleAuthError: (err: any) => boolean;
};

const LearnersSection: React.FC<LearnersSectionProps> = ({
  selected,
  learners,
  loadingLearners,
  learnersError,
  learnerStatus,
  learnerTypeFilter,
  setLearnerTypeFilter,
  learnerProgramFilter,
  setLearnerProgramFilter,
  learnerSearch,
  setLearnerSearch,
  learnersSort,
  setLearnersSort,
  notify,
  downloadLearnersCsv,
  statusChipColor,
  resolveFileUrl,
  setLearnerDetails,
  setLearners,
  openConfirm,
  authHeaders,
  handleAuthError,
}) => {
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
      {!loadingLearners && !learnersError && learners.length > 0 &&
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
                              href={resolveFileUrl(learner.qualification_file) || undefined}
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
                                      console.error("Error dismissing learner", err);
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
        })()}
    </Paper>
  );
};

export default LearnersSection;
