// ===== MAIN APP COMPONENT =====

import React from "react";

import DashboardPage from "./pages/Dashboard/index";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AddJobForm from "./pages/About/addJob";
import LoginPage from "./pages/Login";
import PrivateRoute from "./components/common/PrivateRoute";
import PublicRoute from "./components/common/PublicRoute";
import NotFoundPage from "./pages/ErrorPage/404";
import ForbiddenPage from "./pages/ErrorPage/403";
import SettingsPage from "./pages/Setting/settingPage";
import GetAllJobs from "./pages/Dashboard/getAllJobs";
import MyJobsPage from "./pages/Dashboard/myJobs";
import ProfilePage from "./pages/Profile";
import ManageUsersPage from "./pages/Admin/User";
// Main App Component
function App() {
  const reduxState = JSON.parse(localStorage.getItem("reduxState") || "{}");
  const isLoggedIn = Object.keys(reduxState).length > 0; // check nếu reduxState có data

  return (
    <>
      <Router>
        <Routes>
          {/* Route mặc định */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public route */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* Private route với role */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={["ADMIN", "USER"]}>
                <DashboardPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/allJobs"
            element={
              <PrivateRoute allowedRoles={["USER"]}>
                <GetAllJobs />
              </PrivateRoute>
            }
          />

          <Route
            path="/myJobs"
            element={
              <PrivateRoute allowedRoles={["ADMIN"]}>
                <MyJobsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/users"
            element={
              <PrivateRoute allowedRoles={["ADMIN"]}>
                <ManageUsersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-job"
            element={
              <PrivateRoute allowedRoles={["ADMIN", "USER"]}>
                <AddJobForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute allowedRoles={["ADMIN", "USER"]}>
                <SettingsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute allowedRoles={["ADMIN", "USER"]}>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          {/* 403 Forbidden */}
          <Route path="/403" element={<ForbiddenPage />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
