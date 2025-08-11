// ===== DASHBOARD PAGE COMPONENT =====

import React, { useEffect, useState } from "react";
import Header from "../../components/Layout/Header";
import "./dashboard.css";
import { Link } from "react-router-dom";
// Dashboard page component
const DashboardPage: React.FC = () => {
  return (
    <>
      <Header />

      <div className="container">
        <aside>
          <nav>
            <Link to="/">Dashboard</Link>
            <Link to="/add-job">Add Job</Link>
            <a href="#">Settings</a>
          </nav>
        </aside>

        <main>
          <h1>My Jobs</h1>

          <div className="search-filter">
            <input type="text" placeholder="Search jobs..." />
            <select>
              <option value="">All Status</option>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="rejected">Rejected</option>
            </select>

            <Link to="/add-job" className="add-job-btn">
              Add Job
            </Link>
          </div>

          <div className="job-list">
            <div className="job-card">
              <div className="job-title">Frontend Developer</div>
              <div className="company-name">Acme Corp</div>
              <div className="job-status">Applied</div>
              <div className="job-date">Applied: 2025-08-01</div>
              <div className="job-actions">
                <button className="btn-edit">Edit</button>
                <button className="btn-delete">Delete</button>
              </div>
            </div>

            <div className="job-card">
              <div className="job-title">Backend Engineer</div>
              <div className="company-name">Tech Solutions</div>
              <div
                className="job-status"
                style={{ backgroundColor: "#fde2e1", color: "#b91c1c" }}
              >
                Rejected
              </div>
              <div className="job-date">Applied: 2025-07-25</div>
              <div className="job-actions">
                <button className="btn-edit">Edit</button>
                <button className="btn-delete">Delete</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardPage;
