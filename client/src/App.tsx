import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AboutEnerhu from "./pages/AboutEnerhu";
import Enroll from "./pages/Enroll";
import Contact from "./pages/Contact";
import Learnerships from "./pages/Learnerships";
import Internships from "./pages/Internships";
import Gallery from "./pages/Gallery";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";

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
