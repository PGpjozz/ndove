import React from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import axios from "axios";
import API_BASE from "../../apiConfig";

type SettingsSectionProps = {
  companyProfileUrl: string | null;
  setCompanyProfileUrl: (v: string | null) => void;
  uploadingProfile: boolean;
  setUploadingProfile: (v: boolean) => void;
  profileError: string | null;
  setProfileError: (v: string | null) => void;

  notify: (message: string, severity?: "success" | "info" | "warning" | "error") => void;
  authHeaders: () => Record<string, string>;
  resolveFileUrl: (path?: string | null) => string | null;
};

const SettingsSection: React.FC<SettingsSectionProps> = ({
  companyProfileUrl,
  setCompanyProfileUrl,
  uploadingProfile,
  setUploadingProfile,
  profileError,
  setProfileError,
  notify,
  authHeaders,
  resolveFileUrl,
}) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>
        Admin Settings
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Upload the latest company profile PDF used on the public About page.
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
            const res = await axios.post(`${API_BASE}/api/company-profile/`, formData, {
              headers: {
                ...authHeaders(),
                "Content-Type": "multipart/form-data",
              },
            });
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
        <Button type="submit" variant="contained" disabled={uploadingProfile}>
          {uploadingProfile ? "Uploading..." : "Save Company Profile"}
        </Button>
      </Box>
    </Paper>
  );
};

export default SettingsSection;
