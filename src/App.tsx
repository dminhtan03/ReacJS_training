// ===== MAIN APP COMPONENT =====

import React from "react";

import DashboardPage from "./pages/Dashboard/index";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddJobForm from "./pages/About/addJob";
import LoginPage from "./pages/Login";

// Main App Component
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/add-job" element={<AddJobForm />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
