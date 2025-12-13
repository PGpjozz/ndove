import React from "react";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import axios from "axios";
import API_BASE from "../../apiConfig";

type OpportunitiesSectionProps = {
  loadingOpps: boolean;
  oppsError: string | null;
  opportunities: any[];

  newOppTitle: string;
  setNewOppTitle: (v: string) => void;
  newOppType: string;
  setNewOppType: (v: string) => void;
  newOppDescription: string;
  setNewOppDescription: (v: string) => void;

  setOpportunities: React.Dispatch<React.SetStateAction<any[]>>;

  notify: (message: string, severity?: "success" | "info" | "warning" | "error") => void;
  openConfirm: (title: string, message: string, action: () => void) => void;
  authHeaders: () => Record<string, string>;
  handleAuthError: (err: any) => boolean;
};

const OpportunitiesSection: React.FC<OpportunitiesSectionProps> = ({
  loadingOpps,
  oppsError,
  opportunities,
  newOppTitle,
  setNewOppTitle,
  newOppType,
  setNewOppType,
  newOppDescription,
  setNewOppDescription,
  setOpportunities,
  notify,
  openConfirm,
  authHeaders,
  handleAuthError,
}) => {
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
            <Box key={opp.id} sx={{ borderBottom: "1px solid #eee", py: 1, mb: 1 }}>
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
                        await axios.delete(`${API_BASE}/api/programs/${opp.id}/`, {
                          headers: authHeaders(),
                        });
                        setOpportunities((prev) => prev.filter((o) => o.id !== opp.id));
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
};

export default OpportunitiesSection;
