import { ArrowBigLeft, Menu, X } from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const reduxState = JSON.parse(localStorage.getItem("reduxState") || "{}");
  const userRole: string | undefined = reduxState?.auth?.role;
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getLinkClass = (path: string) => {
    const baseClass = "block p-2 mb-2 font-semibold rounded transition dark:text-white";
    const activeClass = "bg-violet-600 text-white";
    const inactiveClass =
      "text-gray-700 hover:bg-violet-200 hover:text-violet-800";

    return `${baseClass} ${isActive(path) ? activeClass : inactiveClass}`;
  };

  return (
    <aside
      className={`
        ${isCollapsed ? "w-16" : "w-[220px]"} 
        bg-gray-100 p-4 transition-all duration-300
        hidden md:block dark:bg-[#111827] dark:text-white
      ` }  style={{height: "100vh"}}
    >
      {/* Toggle Button - Only visible on desktop */}
      <button
        onClick={toggleSidebar}
        className="w-full flex items-center cursor-pointer justify-center p-2 mb-4 dark:text-gray-500 text-gray-600 hover:text-violet-800 hover:bg-violet-200 rounded"
      >
        {isCollapsed ? (
          <Menu className="w-5 h-5" />
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="mr-5 font-bold text-xl dark:text-white">MENU</span> <X className="w-5 h-5 dark:text-white" />

          </div>
        )}
      </button>

      {/* Navigation */}
      <nav>
        <Link
          to="/"
          className={getLinkClass("/")}
          title={isCollapsed ? "Dashboard" : ""}
        >
          {isCollapsed ? "🏠" : "🏠 Dashboard"}
        </Link>
        {/* Chỉ hiển thị nếu là USER */}
        {userRole === "USER" && (
          <Link
            to="/allJobs"
            className={getLinkClass("/allJobs")}
            title={isCollapsed ? "All Jobs" : ""}
          >
            {isCollapsed ? "📄" : "📄 All Jobs"}
          </Link>
        )}

        <Link
          to="/add-job"
          className={getLinkClass("/add-job")}
          title={isCollapsed ? "Add Job" : ""}
        >
          {isCollapsed ? "➕" : "➕ Add Job"}
        </Link>
        <Link
          to="/settings"
          className={getLinkClass("/settings")}
          title={isCollapsed ? "Settings" : ""}
        >
          {isCollapsed ? "⚙️" : "⚙️ Settings"}
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
