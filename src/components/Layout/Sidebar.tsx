import { ArrowBigLeft, Menu, X, Home, Briefcase, Plus, Settings, BarChart3 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);
  const location = useLocation();
  const reduxState = JSON.parse(localStorage.getItem("reduxState") || "{}");
  const userRole: string | undefined = reduxState?.auth?.role;

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getLinkClass = (path: string) => {
    const baseClass = `
      relative flex items-center gap-3 p-3 mb-2 rounded-xl font-medium 
      transition-all duration-300 ease-in-out group overflow-hidden
      dark:text-gray-300 text-gray-700
    `;
    const activeClass = `
      bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg
      shadow-violet-500/25 transform scale-[1.02]
    `;
    const inactiveClass = `
      hover:bg-gradient-to-r hover:from-violet-100 hover:to-purple-100 
      hover:text-violet-800 hover:shadow-md hover:transform hover:scale-[1.01]
      dark:hover:from-violet-900/30 dark:hover:to-purple-900/30 
      dark:hover:text-violet-300
    `;
    return `${baseClass} ${isActive(path) ? activeClass : inactiveClass}`;
  };

  const getNavigationItems = () => {
    if (userRole === "USER") {
      return [
        { path: "/", icon: Home, label: "My Jobs" },
        { path: "/allJobs", icon: Briefcase, label: "All Jobs" },
        { path: "/add-job", icon: Plus, label: "Add Job" },
        { path: "/settings", icon: Settings, label: "Settings" },
      ];
    } else if (userRole === "ADMIN") {
      return [
        { path: "/", icon: BarChart3, label: "Dashboard" },
        { path: "/myJobs", icon: Briefcase, label: "My Jobs" },
        { path: "/add-job", icon: Plus, label: "Add Job" },
        { path: "/settings", icon: Settings, label: "Settings" },
      ];
    }
    return [];
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {!isCollapsed && (
        <div
          className={`
            fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden
            transition-opacity duration-300 ease-in-out
            ${isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"}
          `}
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <aside
        className={`
    ${isCollapsed && window.innerWidth < 768 ? "hidden" : ""}
    ${isCollapsed && window.innerWidth >= 768 ? "w-20" : "w-72"}
    bg-white/80 backdrop-blur-xl border-r border-gray-200/50
    transition-all duration-300 ease-in-out
    fixed md:relative z-50 md:z-auto
    dark:bg-gray-900/80 dark:border-gray-700/50
    shadow-xl md:shadow-none 
  `}
  style={{ minHeight: "100vh" }}
      >
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <button
            onClick={toggleSidebar}
            className={`
              w-full flex items-center justify-center p-3 rounded-xl
              bg-gradient-to-r from-violet-500 to-purple-600 text-white
              hover:from-violet-600 hover:to-purple-700 
              transition-all duration-300 ease-in-out
              shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30
              hover:scale-105 active:scale-95
            `}
          >
            {isCollapsed ? (
              <Menu className="w-6 h-6" />
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-lg tracking-wide">MENU</span>
                <X className="w-6 h-6" />
              </div>
            )}
          </button>
        </div>

        {!isCollapsed && (
          <div className="px-6 pt-4 pb-2">
            <div
              className={`
                inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                ${userRole === "ADMIN" 
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" 
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                }
              `}
            >
              <div
                className={`
                  w-2 h-2 rounded-full mr-2
                  ${userRole === "ADMIN" ? "bg-amber-500" : "bg-blue-500"}
                `}
              />
              {userRole}
            </div>
          </div>
        )}

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={getLinkClass(item.path)}
                title={isCollapsed ? item.label : ""}
              >
                {isActive(item.path) && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
                )}
                <Icon
                  className={`
                    w-6 h-6 flex-shrink-0 transition-transform duration-300
                    ${isActive(item.path) ? "text-white" : ""}
                    group-hover:scale-110
                  `}
                />
                <span
                  className={`
                    font-medium transition-all duration-300
                    ${isCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"}
                  `}
                >
                  {item.label}
                </span>
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-violet-400/10 to-purple-400/10 -z-10" />
              </Link>
            );
          })}
        </nav>

        {!isCollapsed && (
          <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {userRole?.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {userRole === "ADMIN" ? "Administrator" : "User Account"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {userRole?.toLowerCase()} access
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(true)}
          className="absolute top-4 right-4 p-3 rounded-full bg-violet-500 text-white shadow-md hover:bg-violet-600 md:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </aside>
    </>
  );
};

export default Sidebar;