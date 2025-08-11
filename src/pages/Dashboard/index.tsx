import React from "react";
import Header from "../../components/Layout/Header";
import { Link } from "react-router-dom";
import JobCard from "@/components/ui/JobCard";

const DashboardPage: React.FC = () => {
  return (
    <>
      <Header />

      <div className="flex min-h-[calc(100vh-64px)] bg-gray-50 text-gray-900">
        {/* Sidebar */}
        <aside className="w-[220px] bg-gray-100 p-4">
          <nav>
            <a
              href="#"
              className="block px-4 py-3 mb-2 text-gray-700 font-semibold rounded hover:bg-violet-200 hover:text-violet-800 transition"
            >
              Dashboard
            </a>
            <Link
              to="/add-job"
              className="block cursor-pointer px-4 py-3 mb-2 text-gray-700 font-semibold rounded hover:bg-violet-200 hover:text-violet-800 transition"
            >
              Add Job
            </Link>
            <a
              href="#"
              className="block px-4 py-3 mb-2 text-gray-700 font-semibold rounded hover:bg-violet-200 hover:text-violet-800 transition"
            >
              Settings
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-8 bg-white">
          <h1 className="text-2xl font-bold mb-6">My Jobs</h1>

          {/* Search & Filter */}
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search jobs..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-base"
            />
            <select className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-base">
              <option value="">All Status</option>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="rejected">Rejected</option>
            </select>
            <Link
              to="/add-job"
              className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg font-semibold transition"
            >
              Add Job
            </Link>
          </div>

          {/* Job Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <JobCard
              title="Frontend Developer"
              company="Acme Corp"
              status="Applied"
              date="2025-08-01"
            />
            <JobCard
              title="Backend Engineer"
              company="Tech Solutions"
              status="Rejected"
              date="2025-07-25"
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardPage;
