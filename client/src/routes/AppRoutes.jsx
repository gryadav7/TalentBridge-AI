import { Routes, Route } from "react-router-dom";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Resume from "../pages/Resume";
import Skills from "../pages/Skills";
import Jobs from "../pages/Jobs";
import Applications from "../pages/Applications";
import JobDetails from "../pages/JobDetails";
import Subscription from "../pages/Subscription";
import CompanyProfile from "../pages/CompanyProfile";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<h1>TalentBridge AI</h1>} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* Protected Candidate Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/subscription" element={<Subscription />} />
      </Route>

      <Route path="/profile" element={<Profile />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="/skills" element={<Skills />} />

      <Route path="/jobs" element={<Jobs />} />

      <Route path="/applications" element={<Applications />} />

      <Route path="/jobs/:jobId" element={<JobDetails />} />
      <Route
        path="/company/profile"
        element={
          <ProtectedRoute>
            <CompanyProfile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
