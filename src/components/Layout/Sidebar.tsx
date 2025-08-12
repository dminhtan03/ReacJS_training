import { ArrowBigLeft, Menu } from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getLinkClass = (path: string) => {
    const baseClass = "block p-2 mb-2 font-semibold rounded transition";
    const activeClass = "bg-violet-600 text-white";
    const inactiveClass = "text-gray-700 hover:bg-violet-200 hover:text-violet-800";
    
    return `${baseClass} ${isActive(path) ? activeClass : inactiveClass}`;
  };

  return (
    <aside 
      className={`
        ${isCollapsed ? 'w-16' : 'w-[220px]'} 
        bg-gray-100 p-4 transition-all duration-300
        hidden md:block
      `}
    >
      {/* Toggle Button - Only visible on desktop */}
      <button
        onClick={toggleSidebar}
        className="w-full flex items-center cursor-pointer justify-center p-2 mb-4 text-gray-600 hover:text-violet-800 hover:bg-violet-200 rounded"
      >
        {isCollapsed ? (
          <Menu className="w-5 h-5" />
        ) : (
          <ArrowBigLeft className="w-5 h-5" />
        )}
      </button>

      {/* Navigation */}
      <nav>
        <Link
          to="/"
          className={getLinkClass("/")}
          title={isCollapsed ? "Dashboard" : ""}
        >
          {isCollapsed ? "🏠" : "Dashboard"}
        </Link>
        
        <Link
          to="/add-job"
          className={getLinkClass("/add-job")}
          title={isCollapsed ? "Add Job" : ""}
        >
          {isCollapsed ? "➕" : "Add Job"}
        </Link>
        
        <Link
          to="/settings"
          className={getLinkClass("/settings")}
          title={isCollapsed ? "Settings" : ""}
        >
          {isCollapsed ? "⚙️" : "Settings"}
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;