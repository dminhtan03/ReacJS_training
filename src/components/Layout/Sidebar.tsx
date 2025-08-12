// ===== HEADER COMPONENT =====
import React from "react";
import { Link } from "react-router-dom";
const Sidebar: React.FC = () => {
  return (
    <aside className="w-[220px] bg-gray-100 p-4">
      <nav>
        <Link
          to="/"
          className="block px-4 py-3 mb-2 text-gray-700 font-semibold rounded hover:bg-violet-200 hover:text-violet-800 transition"
        >
          Dashboard
        </Link>
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
  );
};

export default Sidebar;
