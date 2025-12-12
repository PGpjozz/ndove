const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? "http://localhost:8000"
    : "https://enerhu-api-a4f4dd8868be.herokuapp.com");

export default API_BASE;
