// ===== HEADER COMPONENT =====
import { ArrowBigLeft, Menu, X } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  }
  return (
    <aside className={`${isCollapsed  ? 'w-16' : 'w-[220px]'}  bg-gray-100 p-4 transition-all duration-300`}>
      <button
        onClick={toggleSidebar}
        className="w-full flex items-center cursor-pointer justify-center p-2 mb-4 text-gray-600 hover:text-violet-800 hover:bg-violet-200 rounded"
      >
        {isCollapsed ? <Menu className="w-5 h-5" /> : <ArrowBigLeft className="w-5 h-5" />}
      </button>
      <nav>
        <Link
          to="/"
          className="block p-2 mb-2 text-gray-700 font-semibold rounded hover:bg-violet-200 hover:text-violet-800 transition"
          title={isCollapsed ? "Dashboard" : ""}
        >
          {isCollapsed ? "🏠" : "Dashboard"}
        </Link>
        <Link
          to="/add-job"
          className="block cursor-pointer p-2 mb-2 mb-2 text-gray-700 font-semibold rounded hover:bg-violet-200 hover:text-violet-800 transition"
          title={isCollapsed ? "Add Job" : ""}
        >
          {isCollapsed ? "➕" : "Add Job"}
        </Link>
        <a
          href="#"
          className="block p-2 mb-2-3 mb-2 text-gray-700 font-semibold rounded hover:bg-violet-200 hover:text-violet-800 transition"
          title={isCollapsed ? "Settings" : ""}
        >
           {isCollapsed ? "⚙️" : "Settings"}
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;

