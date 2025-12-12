import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import Navbar from "../components/Navbar";
import API_BASE from "../apiConfig";
import enerhuLogo from "../assets/enerhu_logo.jpg";

type GalleryPost = {
  id: number;
  title?: string;
  caption?: string;
  image?: string;
  created_at?: string;
};

const Gallery: React.FC = () => {
  const [items, setItems] = useState<GalleryPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<GalleryPost | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const resolveImageUrl = (image?: string) => {
    if (!image) return "";
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    const base = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
    const path = image.startsWith("/") ? image : `/${image}`;
    return `${base}${path}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${API_BASE}/api/gallery/`);
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray((res.data as any)?.results)
          ? (res.data as any).results
          : [];
        setItems(data);
      } catch (err) {
        console.error("Error loading gallery", err);
        setError("Could not load gallery posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #fff7e6 0%, #ffe0b3 40%, #ffffff 100%)",
          display: "flex",
          justifyContent: "center",
          py: 6,
          px: { xs: 2, md: 4 },
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", sm: "95%", md: 1100, lg: 1200 },
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: 3,
            boxShadow:
              "0 10px 25px rgba(0,0,0,0.12), 0 4px 10px rgba(0,0,0,0.08)",
            border: "1px solid rgba(0,0,0,0.05)",
            bgcolor: "#ffffff",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#ff8800",
              textAlign: "center",
              mb: { xs: 2, md: 3 },
            }}
          >
            Gallery
          </Typography>

          {loading && <Typography>Loading gallery...</Typography>}
          {error && (
            <Typography color="error" mb={2}>
              {error}
            </Typography>
          )}
          {!loading && !error && items.length === 0 && (
            <Typography>No gallery posts yet.</Typography>
          )}

          {!loading && !error && items.length > 0 && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))" },
                gap: { xs: 1.5, sm: 2.5, md: 3 },
              }}
            >
              {items.map((post) => (
                <Paper
                  key={post.id}
                  variant="outlined"
                  sx={{
                    height: "100%",
                    p: 2,
                    borderRadius: 2,
                    borderColor: "rgba(0,0,0,0.04)",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      transform: { md: "translateY(-2px)" },
                      boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
                    <Box
                      component="img"
                      src={enerhuLogo}
                      alt="Enerhu logo"
                      sx={{
                        height: 36,
                        width: 36,
                        borderRadius: 2,
                        objectFit: "cover",
                      }}
                    />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography fontWeight={600} noWrap>
                        Enerhu
                      </Typography>
                      {post.created_at && (
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {new Date(post.created_at).toLocaleString()}
                        </Typography>
                      )}
                    </Box>
                  </Stack>

                  {post.image ? (
                    <Box
                      sx={{
                        width: "100%",
                        aspectRatio: "16 / 9",
                        borderRadius: 2,
                        overflow: "hidden",
                        bgcolor: "rgba(0,0,0,0.04)",
                        mb: 1.5,
                      }}
                    >
                      <Box
                        component="img"
                        src={resolveImageUrl(post.image)}
                        alt={post.title || post.caption || "Gallery image"}
                        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </Box>
                  ) : null}

                  {(post.title || post.caption) && (
                    <Typography
                      fontWeight={600}
                      sx={{
                        mb: 0.5,
                        display: "-webkit-box",
                        overflow: "hidden",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                      }}
                    >
                      {post.title || post.caption}
                    </Typography>
                  )}

                  {post.caption && post.title && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        overflow: "hidden",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3,
                      }}
                    >
                      {post.caption}
                    </Typography>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mt: "auto",
                      pt: 1,
                    }}
                  >
                    <Button size="small" variant="text" onClick={() => setSelectedPost(post)}>
                      View
                    </Button>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
          <Dialog
            open={Boolean(selectedPost)}
            onClose={() => setSelectedPost(null)}
            fullScreen={isMobile}
            maxWidth="md"
            fullWidth
          >
            {selectedPost && (
              <>
                <DialogTitle>{selectedPost.title || selectedPost.caption || "Gallery"}</DialogTitle>
                <DialogContent>
                  {selectedPost.image && (
                    <Box
                      sx={{
                        mb: 2,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={resolveImageUrl(selectedPost.image)}
                        alt={selectedPost.title || selectedPost.caption || "Gallery image"}
                        style={{
                          width: "100%",
                          maxWidth: 900,
                          maxHeight: isMobile ? "60vh" : "70vh",
                          borderRadius: 4,
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                  )}
                  {selectedPost.created_at && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 1 }}
                    >
                      {new Date(selectedPost.created_at).toLocaleString()}
                    </Typography>
                  )}
                  {selectedPost.caption && (
                    <Typography variant="body2">{selectedPost.caption}</Typography>
                  )}
                </DialogContent>
              </>
            )}
          </Dialog>
        </Paper>
      </Box>
    </>
  );
};

export default Gallery;
