import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  Edit3,
  Save,
  RefreshCcw,
  Camera,
  Check,
  Shield,
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Header, Sidebar } from "@/components/Layout";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  department: string;
  createdAt?: string;
}

interface ProfilePageProps {
  userId?: string;
  onSave?: (profile: UserProfile) => void;
  onBack?: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  onSave,
  onBack,
}) => {
  const reduxState = JSON.parse(localStorage.getItem("reduxState") || "{}");

  const userId: string | undefined = reduxState?.auth?.id;

  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    department: "",
  });
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<UserProfile>>({});
  const [apiError, setApiError] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch profile data from API
  const fetchProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      setApiError("");
      const response = await fetch(
        `https://689c2efc58a27b18087d282f.mockapi.io/api/v1/users/signup/${userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
      
      const userData = await response.json();
      const profileData: UserProfile = {
        id: userData.id || userId,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
        department: userData.department || "",
        createdAt: userData.createdAt,
      };
      
      setProfile(profileData);
      setOriginalProfile(profileData);
      setErrors({});
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setApiError(errorMessage);
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile data via API
  const updateProfile = async (profileData: UserProfile) => {
    try {
      const response = await fetch(
        `https://689c2efc58a27b18087d282f.mockapi.io/api/v1/users/signup/${profileData.id}`,
        {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            email: profileData.email,
            phoneNumber: profileData.phoneNumber,
            department: profileData.department,
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to update user profile");
      }
      
      const updatedData = await response.json();
      return updatedData;
    } catch (error) {
      throw error instanceof Error ? error : new Error("Unknown error occurred");
    }
  };

  useEffect(() => {
    fetchProfile(userId);
  }, [userId]);

  const validateForm = (): boolean => {
    const newErrors: Partial<UserProfile> = {};

    if (!profile.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!profile.lastName.trim()) 
      newErrors.lastName = "Last name is required";
    if (!profile.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!profile.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    if (!profile.department) 
      newErrors.department = "Department is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSave = async () => {
  if (!validateForm()) return;

  setIsSaving(true);
  try {
    // Gọi API update thay vì setTimeout
    const updatedProfile = await updateProfile(profile);

    if (onSave) {
      onSave(updatedProfile);
    }

    setProfile(updatedProfile);
    setOriginalProfile(updatedProfile);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  } catch (error) {
    console.error("Error saving profile:", error);
    setApiError("Unable to save information. Please try again.");
  } finally {
    setIsSaving(false);
  }
};


  const handleCancel = () => {
    if (originalProfile) {
      setProfile(originalProfile);
    }
    setIsEditing(false);
    setErrors({});
  };

  const getInitials = () => {
    return `${profile.firstName?.charAt(0) || ""}${profile.lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return "Not specified";
    }
  };

  const handleRetry = () => {
    fetchProfile(userId);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Loading profile information...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (apiError && !originalProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Data Loading Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {apiError}
          </p>
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg"
            >
              <RefreshCcw className="w-4 h-4 inline mr-2" />
              Try Again
            </button>
            <button
              onClick={handleBackClick}
              className="w-full px-6 py-3 text-gray-600 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
            >
              <ArrowLeft className="w-4 h-4 inline mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
      {/* Header */}
      <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center space-x-2 animate-fade-in">
          <Check className="w-5 h-5" />
          <span className="font-medium">Saved successfully!</span>
        </div>
      )}

      {/* API Error Message */}
      {apiError && originalProfile && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300 text-sm">
              {apiError}
            </p>
            <button
              onClick={() => setApiError("")}
              className="text-red-500 hover:text-red-700 ml-auto"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="flex min-h-[calc(100vh-80px)]">
        <div className={`fixed inset-y-0 left-0 z-40 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:flex transition-transform duration-300 ease-in-out`}>
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                {/* Profile Header */}
                <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 p-8 text-white">
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl">
                        <span className="text-3xl font-bold text-white">
                          {getInitials()}
                        </span>
                      </div>
                      <button className="absolute -bottom-2 -right-2 bg-white/20 backdrop-blur-md p-2 rounded-full border-2 border-white/30 hover:bg-white/30 transition-colors">
                        <Camera className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <h2 className="text-2xl font-bold mb-1">
                      {profile.firstName} {profile.lastName}
                    </h2>
                    <p className="text-white/80">{profile.department}</p>
                    {/* <p className="text-white/60 text-sm mt-1">ID: {profile.id}</p> */}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-purple-600/20" />
                </div>

                {/* Quick Stats */}
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">Account Status</span>
                      </div>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                        Active
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">Member Since</span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(profile.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                {/* Form Header */}
                <div className="p-8 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {isEditing ? "Edit Profile" : "User Profile"}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {isEditing ? "Update your personal information" : "View and manage your profile information"}
                      </p>
                    </div>
                    
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl hover:from-violet-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-8">
                  {!isEditing ? (
                    /* View Mode */
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-2xl border border-blue-200/50 dark:border-blue-700/50">
                          <div className="flex items-center space-x-3">
                            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                First Name
                              </p>
                              <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                                {profile.firstName || "Not updated"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Last Name */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-2xl border border-blue-200/50 dark:border-blue-700/50">
                          <div className="flex items-center space-x-3">
                            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                Last Name
                              </p>
                              <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                                {profile.lastName || "Not updated"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Email */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-2xl border border-green-200/50 dark:border-green-700/50">
                          <div className="flex items-center space-x-3">
                            <div className="p-3 bg-green-500 rounded-xl shadow-lg">
                              <Mail className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                                Email Address
                              </p>
                              <p className="text-xl font-bold text-green-900 dark:text-green-100 truncate">
                                {profile.email || "Not updated"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-2xl border border-orange-200/50 dark:border-orange-700/50">
                          <div className="flex items-center space-x-3">
                            <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
                              <Phone className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                                Phone Number
                              </p>
                              <p className="text-xl font-bold text-orange-900 dark:text-orange-100">
                                {profile.phoneNumber || "Not updated"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Department - Full Width */}
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-2xl border border-purple-200/50 dark:border-purple-700/50">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
                            <Building className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                              Department
                            </p>
                            <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                              {profile.department || "Not assigned"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Edit Mode */
                    <div className="space-y-6">
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-6 mb-8">
                        <div className="flex items-center space-x-3">
                          <Edit3 className="w-6 h-6 text-amber-600" />
                          <div>
                            <h4 className="font-bold text-amber-800 dark:text-amber-200">
                              Editing Profile
                            </h4>
                            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                              Make changes to your profile information. All fields marked with * are required.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                            <User className="w-4 h-4 inline mr-2 text-blue-500" />
                            First Name *
                          </label>
                          <input
                            type="text"
                            value={profile.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            className={`w-full px-4 py-4 border-2 rounded-2xl text-gray-700 dark:text-white transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none ${
                              errors.firstName
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50 dark:bg-red-900/20"
                                : "border-gray-200 dark:border-gray-600 focus:border-blue-500 bg-white dark:bg-gray-700"
                            } placeholder-gray-400`}
                            placeholder="Enter your first name"
                          />
                          {errors.firstName && (
                            <p className="text-red-500 text-sm mt-2 font-medium">
                              {errors.firstName}
                            </p>
                          )}
                        </div>

                        {/* Last Name */}
                        <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                            <User className="w-4 h-4 inline mr-2 text-blue-500" />
                            Last Name *
                          </label>
                          <input
                            type="text"
                            value={profile.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            className={`w-full px-4 py-4 border-2 rounded-2xl text-gray-700 dark:text-white transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none ${
                              errors.lastName
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50 dark:bg-red-900/20"
                                : "border-gray-200 dark:border-gray-600 focus:border-blue-500 bg-white dark:bg-gray-700"
                            } placeholder-gray-400`}
                            placeholder="Enter your last name"
                          />
                          {errors.lastName && (
                            <p className="text-red-500 text-sm mt-2 font-medium">
                              {errors.lastName}
                            </p>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                            <Mail className="w-4 h-4 inline mr-2 text-green-500" />
                            Email Address *
                          </label>
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className={`w-full px-4 py-4 border-2 rounded-2xl text-gray-700 dark:text-white transition-all duration-200 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none ${
                              errors.email
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50 dark:bg-red-900/20"
                                : "border-gray-200 dark:border-gray-600 focus:border-green-500 bg-white dark:bg-gray-700"
                            } placeholder-gray-400`}
                            placeholder="Enter your email address"
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm mt-2 font-medium">
                              {errors.email}
                            </p>
                          )}
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                            <Phone className="w-4 h-4 inline mr-2 text-orange-500" />
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            value={profile.phoneNumber}
                            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                            className={`w-full px-4 py-4 border-2 rounded-2xl text-gray-700 dark:text-white transition-all duration-200 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none ${
                              errors.phoneNumber
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50 dark:bg-red-900/20"
                                : "border-gray-200 dark:border-gray-600 focus:border-orange-500 bg-white dark:bg-gray-700"
                            } placeholder-gray-400`}
                            placeholder="Enter your phone number"
                          />
                          {errors.phoneNumber && (
                            <p className="text-red-500 text-sm mt-2 font-medium">
                              {errors.phoneNumber}
                            </p>
                          )}
                        </div>

                        {/* Department */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                            <Building className="w-4 h-4 inline mr-2 text-purple-500" />
                            Department *
                          </label>
                          <select
                            value={profile.department}
                            onChange={(e) => handleInputChange("department", e.target.value)}
                            className={`w-full px-4 py-4 border-2 rounded-2xl text-gray-700 dark:text-white transition-all duration-200 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none appearance-none cursor-pointer ${
                              errors.department
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50 dark:bg-red-900/20"
                                : "border-gray-200 dark:border-gray-600 focus:border-purple-500 bg-white dark:bg-gray-700"
                            }`}
                          >
                            <option value="">Select your department</option>
                            <option value="Information Technology">Information Technology</option>
                            <option value="Human Resources">Human Resources</option>
                            <option value="Finance">Finance</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Sales">Sales</option>
                            <option value="Operations">Operations</option>
                            <option value="Accounting">Accounting</option>
                            <option value="Legal">Legal</option>
                          </select>
                          {errors.department && (
                            <p className="text-red-500 text-sm mt-2 font-medium">
                              {errors.department}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={handleCancel}
                          disabled={isSaving}
                          className="px-8 py-3 text-gray-600 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-semibold disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl hover:from-violet-700 hover:to-purple-700 transition-all duration-200 font-semibold disabled:opacity-50 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                        >
                          {isSaving ? (
                            <>
                              <RefreshCcw className="w-5 h-5 animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-5 h-5" />
                              <span>Save Changes</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;