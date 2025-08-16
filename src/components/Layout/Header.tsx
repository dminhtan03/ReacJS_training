import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, User, Settings, LogOut, Home, Plus, Info, ChevronDown, Sparkles, Bell } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "../store/slice/authSlice";
import { authService } from "../../service/authService";
import ProfileModal from "./ProfileModal";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState<ProfileFormData[]>([]);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const reduxState = JSON.parse(localStorage.getItem("reduxState") || "{}");
  const userId: string | undefined = reduxState?.auth?.id;
  const role: string | undefined = reduxState?.auth?.role;
  const dispatch = useDispatch();

  const { firstName, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    try {
      const userProfile = await authService.profile(userId);
      setShowProfile(userProfile);
      setProfileModalOpen(true);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  const handleSaveProfile = async (profileData: ProfileFormData) => {
    try {
      const updatedProfile = await authService.profile(profileData.userId);
      setShowProfile(updatedProfile);
      setProfileModalOpen(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <>
      {/* Ultra Modern Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl border-b border-gray-200/30 dark:border-gray-700/30" 
          : "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-gray-900 dark:via-slate-900 dark:to-black"
      }`}>
        
        {/* Animated gradient overlay */}
        {!isScrolled && (
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-indigo-600/20 animate-pulse" />
        )}
        
        <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Premium Logo */}
            <div
              className={`flex items-center gap-3 cursor-pointer transition-all duration-300 hover:scale-105 group ${
                isScrolled ? "text-gray-900 dark:text-white" : "text-white"
              }`}
              onClick={() => handleNavigation("/")}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full animate-pulse" />
              </div>
              <div className="font-bold text-2xl">
                <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                  Job
                </span>
                <span className={`transition-colors duration-300 ${
                  isScrolled ? "text-gray-900 dark:text-white" : "text-white"
                }`}>
                  Tracker
                </span>
              </div>
            </div>

            {/* Desktop Navigation - Ultra Modern */}
            <nav className="hidden lg:flex items-center gap-2">
              {/* Navigation Pills */}
              <div className={`flex items-center gap-1 p-1 rounded-2xl transition-all duration-300 ${
                isScrolled 
                  ? "bg-gray-100/80 dark:bg-gray-800/80" 
                  : "bg-white/10 backdrop-blur-sm"
              }`}>
                <button
                  onClick={() => handleNavigation("/")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105 ${
                    isScrolled
                      ? "text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-violet-600 dark:hover:text-violet-400 hover:shadow-lg"
                      : "text-white/90 hover:text-white hover:bg-white/20"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Home
                </button>
                
                <button
                  onClick={() => handleNavigation("/add-job")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105 ${
                    isScrolled
                      ? "text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-violet-600 dark:hover:text-violet-400 hover:shadow-lg"
                      : "text-white/90 hover:text-white hover:bg-white/20"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Add job
                </button>
              </div>

              {/* Premium User Section */}
              {firstName && (
                <div className="flex items-center gap-4 ml-6">
                  {/* Notifications */}
                  {/* <button className={`relative p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                    isScrolled
                      ? "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}>
                    <Bell className="w-5 h-5" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full animate-pulse" />
                  </button> */}

                  {/* User Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 group ${
                        isScrolled
                          ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-lg"
                          : "text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                      }`}
                    >
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                          {firstName.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                      </div>
                      <div className="text-left hidden xl:block">
                        <p className="text-sm font-semibold">Hello !</p>
                        <p className="text-xs opacity-75">{firstName}</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`} />
                    </button>

                    {/* Ultra Modern Dropdown */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-4 w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                        {/* Header with gradient */}
                        <div className="relative px-6 py-6 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-xl backdrop-blur-sm">
                              {firstName.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-white">
                              <h3 className="font-bold text-lg">{firstName}</h3>
                              <p className="text-white/80 text-sm">Job Management</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                <span className="text-xs text-white/80">Active</span>
                              </div>
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-purple-600/20" />
                        </div>

                        {/* Menu Items */}
                        <div className="p-3 space-y-1">
                          <button
                            onClick={() => handleNavigation("/profile")}
                            className="flex items-center gap-4 w-full px-4 py-4 text-left text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600 dark:hover:text-violet-400 rounded-2xl transition-all duration-200 group"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-medium">Profile</p>
                              <p className="text-xs opacity-60">Manage your information</p>
                            </div>
                          </button>

                          {role === "ADMIN" && (
                               <button
                            onClick={() => handleNavigation("/users")}
                            className="flex items-center gap-4 w-full px-4 py-4 text-left text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600 dark:hover:text-violet-400 rounded-2xl transition-all duration-200 group"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-medium">Manage Users</p>
                              <p className="text-xs opacity-60">Manage your information</p>
                            </div>
                          </button>
                          )}
                         
                          
                          <button
                            onClick={() => handleNavigation("/settings")}
                            className="flex items-center gap-4 w-full px-4 py-4 text-left text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-2xl transition-all duration-200 group"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
                              <Settings className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-medium">Settings</p>
                              <p className="text-xs opacity-60">Toggle Theme</p>
                            </div>
                          </button>
                          
                          <div className="border-t border-gray-200 dark:border-gray-700 my-3" />
                          
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-4 w-full px-4 py-4 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all duration-200 group"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
                              <LogOut className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-medium">Logout</p>
                              <p className="text-xs opacity-60">End session</p>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className={`lg:hidden p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
                isScrolled
                  ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  : "text-white hover:bg-white/10 backdrop-blur-sm"
              }`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
            <div className="p-6 space-y-4 max-w-7xl mx-auto">
              {/* Mobile Navigation */}
              <div className="space-y-2">
                <button
                  onClick={() => handleNavigation("/")}
                  className="flex items-center gap-4 w-full px-6 py-4 text-left text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600 dark:hover:text-violet-400 rounded-2xl transition-all duration-200 font-medium"
                >
                  <Home className="w-5 h-5" />
                  Home
                </button>
                
                <button
                  onClick={() => handleNavigation("/add-job")}
                  className="flex items-center gap-4 w-full px-6 py-4 text-left text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 rounded-2xl transition-all duration-200 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add job
                </button>
                
                <button
                  onClick={() => handleNavigation("/settings")}
                  className="flex items-center gap-4 w-full px-6 py-4 text-left text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-2xl transition-all duration-200 font-medium"
                >
                  <Settings className="w-5 h-5" />
                  Settings
                </button>
              </div>

              {firstName && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl p-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                          {firstName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">Hello, {firstName}!</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Job management effectively</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleProfileClick(userId || "")}
                    className="flex items-center gap-4 w-full px-6 py-4 text-left text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600 dark:hover:text-violet-400 rounded-2xl transition-all duration-200 font-medium"
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </button>

                  <button
                    onClick={() => handleNavigation("/profile")}
                    className="flex items-center gap-4 w-full px-6 py-4 text-left text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600 dark:hover:text-violet-400 rounded-2xl transition-all duration-200 font-medium"
                  >
                    <User className="w-5 h-5" />
                    Profile 2
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 w-full px-6 py-4 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all duration-200 font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        userProfile={showProfile}
        onSave={handleSaveProfile}
      />

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Spacer */}
      <div className="h-20" />
    </>
  );
};

export default Header;