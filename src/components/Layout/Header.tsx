import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "../store/slice/authSlice"; // ⚡ import action logout

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // ⚡ trạng thái dropdown
  const dispatch = useDispatch();

  const { firstName, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
    localStorage.clear();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <header className="bg-indigo-600 fixed top-0 text-white w-full shadow-lg z-1000">
      {/* Main Header */}
      <div className="px-4 md:px-6 lg:px-8 py-3 md:py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div
            className="font-bold text-lg md:text-xl lg:text-2xl cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleNavigation("/")}
          >
            JobTracker
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 lg:space-x-6 items-center">
            <button
              onClick={() => handleNavigation("/")}
              className="font-medium text-sm lg:text-base hover:text-indigo-200 transition-colors duration-200 px-2 py-1 rounded"
            >
              Home
            </button>

            <button
              onClick={() => handleNavigation("/about")}
              className="font-medium text-sm lg:text-base hover:text-indigo-200 transition-colors duration-200 px-2 py-1 rounded"
            >
              About
            </button>
            

            {/* ⚡ Dropdown user */}
            {firstName ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center cursor-pointer gap-2 font-medium text-sm lg:text-base hover:text-indigo-200 px-2 py-1 rounded"
                >
                  👋 Chào, {firstName}
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg">
                    <button
                      onClick={handleLogout}
                      className="block cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNavigation("/profile")}
                className="font-medium text-sm lg:text-base hover:text-indigo-200 transition-colors duration-200 px-2 py-1 rounded"
              >
                Profile
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-indigo-700 border-t border-indigo-500 shadow-lg z-50">
          <nav className="px-4 py-2 space-y-1">
            <button
              onClick={() => handleNavigation("/")}
              className="block w-full text-left font-medium text-white hover:text-indigo-200 hover:bg-indigo-600 transition-colors duration-200 px-3 py-2 rounded"
            >
              🏠 Home
            </button>
            <button
              onClick={() => handleNavigation("/add-job")}
              className="block w-full text-left font-medium text-white hover:text-indigo-200 hover:bg-indigo-600 transition-colors duration-200 px-3 py-2 rounded"
            >
              ➕ Add Job
            </button>
            <button
              onClick={() => handleNavigation("/about")}
              className="block w-full text-left font-medium text-white hover:text-indigo-200 hover:bg-indigo-600 transition-colors duration-200 px-3 py-2 rounded"
            >
              ℹ️ About
            </button>

            {firstName ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left font-medium text-white hover:text-indigo-200 hover:bg-indigo-600 transition-colors duration-200 px-3 py-2 rounded"
              >
                🚪 Logout
              </button>
            ) : (
              <button
                onClick={() => handleNavigation("/profile")}
                className="block w-full text-left font-medium text-white hover:text-indigo-200 hover:bg-indigo-600 transition-colors duration-200 px-3 py-2 rounded"
              >
                👤 Profile
              </button>
            )}
          </nav>

          {/* Mobile Menu Footer */}
          <div className="px-4 py-3 border-t border-indigo-500 bg-indigo-800">
            <p className="text-xs text-indigo-200 text-center">
              JobTracker v1.0 - Track your career journey
            </p>
          </div>
        </div>
      )}

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-opacity-25 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        />
      )}
    </header>
  );
};

export default Header;
