import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import API_BASE from "../../apiConfig";

type GallerySectionProps = {
  loadingGallery: boolean;
  galleryError: string | null;
  galleryPosts: any[];

  selectedGalleryPost: any | null;
  setSelectedGalleryPost: (post: any | null) => void;

  newGalleryCaption: string;
  setNewGalleryCaption: (v: string) => void;
  newGalleryBody: string;
  setNewGalleryBody: (v: string) => void;
  newGalleryImage: File | null;
  setNewGalleryImage: (f: File | null) => void;

  setGalleryPosts: React.Dispatch<React.SetStateAction<any[]>>;

  notify: (message: string, severity?: "success" | "info" | "warning" | "error") => void;
  openConfirm: (title: string, message: string, action: () => void) => void;
  authHeaders: () => Record<string, string>;
  handleAuthError: (err: any) => boolean;
  resolveFileUrl: (path?: string | null) => string | null;
};

const GallerySection: React.FC<GallerySectionProps> = ({
  loadingGallery,
  galleryError,
  galleryPosts,
  selectedGalleryPost,
  setSelectedGalleryPost,
  newGalleryCaption,
  setNewGalleryCaption,
  newGalleryBody,
  setNewGalleryBody,
  newGalleryImage,
  setNewGalleryImage,
  setGalleryPosts,
  notify,
  openConfirm,
  authHeaders,
  handleAuthError,
  resolveFileUrl,
}) => {
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
              {selectedGalleryPost.title ||
                selectedGalleryPost.caption ||
                "Gallery"}
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
                <Typography variant="body2">
                  {selectedGalleryPost.caption}
                </Typography>
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
            const res = await axios.post(`${API_BASE}/api/gallery/`, formData, {
              headers: {
                ...authHeaders(),
                "Content-Type": "multipart/form-data",
              },
            });
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
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: "100%" }}>
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
                <Box
                  sx={{
                    mt: 1,
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => setSelectedGalleryPost(post)}
                  >
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
                            await axios.delete(`${API_BASE}/api/gallery/${post.id}/`, {
                              headers: authHeaders(),
                            });
                            setGalleryPosts((prev) =>
                              prev.filter((p) => p.id !== post.id)
                            );
                            notify("Gallery post deleted successfully", "success");
                          } catch (err) {
                            if (handleAuthError(err)) return;
                            console.error("Error deleting gallery post", err);
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
};

export default GallerySection;
