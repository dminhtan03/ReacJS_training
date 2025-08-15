import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Plus,
  Settings,
  Info,
  LogOut,
  User,
  ChevronDown,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "../store/slice/authSlice";
import { authService } from "../../service/authService";
import ProfileModal from "./ProfileModal";
import { Toast } from "../ui";

interface ProfileFormData {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  department: string;
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState<ProfileFormData | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    id: userId,
    firstName,
    isAuthenticated,
  } = useSelector((state: RootState) => state.auth);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest(".dropdown-container")) {
          setIsDropdownOpen(false);
        }
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isDropdownOpen]);

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
    localStorage.clear();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleProfileClick = async (userId: string) => {
    setIsLoading(true);
    try {
      const userProfile = await authService.profile(userId);
      setShowProfile(userProfile);
      setProfileModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (profileData: ProfileFormData) => {
    setIsLoading(true);
    try {
      const updatedProfile = await authService.updateProfile(profileData);
      setShowProfile(updatedProfile);
      setProfileModalOpen(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const menuItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Add Job", path: "/add-job", icon: Plus },
    { label: "Settings", path: "/settings", icon: Settings },
    { label: "Profile", path: "/profile", icon: Info },
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 dark:shadow-gray-900/50 border-b border-gray-200/20 dark:border-gray-700/20"
            : "bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-lg"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 via-purple-600/80 to-violet-600/80 dark:from-gray-900/90 dark:via-gray-800/90 dark:to-gray-900/90 opacity-90" />
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            scrolled ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 animate-pulse" />
        </div>

        <div className="relative px-4 md:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div
              className={`group flex items-center gap-3 cursor-pointer transition-all duration-300 hover:scale-105 ${
                scrolled ? "text-gray-900 dark:text-gray-100" : "text-white"
              }`}
              onClick={() => handleNavigation("/")}
            >
              <div
                className={`p-2 rounded-xl transition-all duration-300 group-hover:rotate-12 ${
                  scrolled
                    ? "bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50"
                    : "bg-white/20 backdrop-blur-sm"
                }`}
              >
                <Briefcase
                  className={`w-6 h-6 ${
                    scrolled
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-white"
                  }`}
                />
              </div>
              <div>
                <h1 className="font-bold text-xl lg:text-2xl bg-gradient-to-r from-current via-current to-current bg-clip-text">
                  JobTracker
                </h1>
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${
                    scrolled
                      ? "text-white/50 dark:text-gray-400"
                      : "text-white/80"
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Track your career</span>
                </div>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm lg:text-base transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
                      scrolled
                        ? "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 hover:text-indigo-600 dark:hover:text-indigo-400"
                        : "text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <IconComponent className="w-4 h-4 transition-transform group-hover:rotate-12" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {firstName && (
                <div className="relative dropdown-container">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm lg:text-base transition-all duration-300 hover:scale-105 ${
                      scrolled
                        ? "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30"
                        : "text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 group-hover:rotate-12 ${
                        scrolled
                          ? "bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-600 dark:text-indigo-400"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {firstName.charAt(0).toUpperCase()}
                    </div>
                    <span>Hi, {firstName}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 text-black dark:text-gray-100 rounded shadow-lg dark:shadow-gray-900/50 border dark:border-gray-700">
                      <button
                        onClick={() => handleProfileClick(userId || "")}
                        className="block cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:text-white duration-200"
                        disabled={isLoading}
                      >
                        👤 Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:text-white duration-200"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </nav>

            <button
              onClick={toggleMobileMenu}
              className={`md:hidden p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                scrolled
                  ? "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  : "hover:bg-white/10 text-white backdrop-blur-sm"
              }`}
              aria-label="Toggle mobile menu"
            >
              <div className="relative w-6 h-6">
                <Menu
                  className={`absolute inset-0 transition-all duration-300 ${
                    isMobileMenuOpen
                      ? "opacity-0 rotate-180 scale-75"
                      : "opacity-100 rotate-0 scale-100"
                  }`}
                />
                <X
                  className={`absolute inset-0 transition-all duration-300 ${
                    isMobileMenuOpen
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 -rotate-180 scale-75"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                      JobTracker
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Mobile Menu
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            <nav className="p-4 space-y-2">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="group w-full flex items-center gap-4 px-4 py-4 text-left rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 transition-all duration-300 hover:scale-105 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-all duration-300 group-hover:rotate-12">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              {firstName ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-700 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {firstName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {firstName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Job Hunter
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="group w-full flex items-center gap-4 px-4 py-4 text-left rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 text-red-600 dark:text-red-400"
                  >
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover:rotate-12 transition-transform">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNavigation("/profile")}
                  className="group w-full flex items-center gap-4 px-4 py-4 text-left rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 transition-all duration-300 text-gray-700 dark:text-gray-300"
                >
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-all duration-300 group-hover:rotate-12">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Profile</span>
                </button>
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                JobTracker v2.0 - Premium Edition
              </p>
            </div>
          </div>
        </div>
      )}

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        userProfile={showProfile}
        onSave={handleSaveProfile}
      />
    </>
  );
};

export default Header;
