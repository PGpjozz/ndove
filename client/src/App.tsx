import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import AboutEnerhu from "./pages/AboutEnerhu";
import Enroll from "./pages/Enroll";
import Contact from "./pages/Contact";
import Learnerships from "./pages/Learnerships";
import Internships from "./pages/Internships";
import Gallery from "./pages/Gallery";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

const RequireAdminAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem("adminAccessToken");
  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
};

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-enerhu" element={<AboutEnerhu />} />
        <Route path="/enroll" element={<Enroll />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/learnerships" element={<Learnerships />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/admin-login" element={<AdminLogin />} /> {" "}
        {/* <-- add route */}
        <Route
          path="/admin-dashboard"
          element={
            <RequireAdminAuth>
              <AdminDashboard />
            </RequireAdminAuth>
          }
        /> {" "}
        {/* <-- add route */}
      </Routes>
    </>
  );
}

export default App;
