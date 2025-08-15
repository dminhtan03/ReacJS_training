import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Building,
  Edit3,
  Save,
  RefreshCcw,
  Camera,
  Check,
} from "lucide-react";

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  department: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSave,
}) => {
  const [profile, setProfile] = useState<UserProfile>({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    department: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<UserProfile>>({});

  console.log("Initial userProfile:", userProfile);
  useEffect(() => {
    console.log("userProfile in useEffect:", userProfile);
    setProfile(userProfile);
    setErrors({});
  }, [userProfile]);

  // Animation classes for modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Partial<UserProfile> = {};

    if (!profile.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!profile.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!profile.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!profile.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    if (!profile.department) newErrors.department = "Department is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onSave(profile);
    setIsSaving(false);
    setIsEditing(false);
    setShowSuccess(true);

    // Hide success message after 2 seconds
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleCancel = () => {
    setProfile(userProfile);
    setIsEditing(false);
    setErrors({});
  };

  const getInitials = () => {
    return `${profile.firstName || ""}${profile.lastName || ""}`;
  };

  return (
    <>
      {/* Backdrop with blur effect */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isOpen ? "backdrop-blur-sm bg-black/50" : "backdrop-blur-0 bg-black/0"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden pointer-events-auto transform transition-all duration-300 ${
            isOpen
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-95 opacity-0 translate-y-4"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Success Message */}
          {showSuccess && (
            <div className="absolute top-4 right-4 z-10 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-in slide-in-from-right-2">
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">
                Profile updated successfully!
              </span>
            </div>
          )}

          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30">
                    <span className="text-xl font-bold text-white">
                      {getInitials()}
                    </span>
                  </div>
                  <button className="absolute -bottom-1 -right-1 bg-white/20 backdrop-blur-md p-1.5 rounded-full border-2 border-white/30 hover:bg-white/30 transition-colors">
                    <Camera className="w-3 h-3 text-white" />
                  </button>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-white/80 text-sm">{profile.department}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white/20 backdrop-blur-md hover:bg-white/30 p-2 rounded-full transition-colors"
                    title="Edit Profile"
                  >
                    <Edit3 className="w-5 h-5 text-white" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="bg-white/20 backdrop-blur-md hover:bg-white/30 p-2 rounded-full transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
            {!isEditing ? (
              /* Profile View Mode */
              <div className="space-y-6">
                {/* Profile Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500 rounded-full">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          First Name
                        </p>
                        <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                          {profile.firstName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Last Name Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500 rounded-full">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          Last Name
                        </p>
                        <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                          {profile.lastName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Email Card */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl border border-green-200/50 dark:border-green-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-500 rounded-full">
                        <Mail className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-700 dark:text-green-300">
                          Email Address
                        </p>
                        <p className="text-lg font-semibold text-green-900 dark:text-green-100 truncate">
                          {profile.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Phone Card */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl border border-orange-200/50 dark:border-orange-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-500 rounded-full">
                        <Phone className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                          Phone Number
                        </p>
                        <p className="text-lg font-semibold text-orange-900 dark:text-orange-100">
                          {profile.phoneNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Department Card - Full Width */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-500 rounded-full">
                      <Building className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                        Department
                      </p>
                      <p className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                        {profile.department || "No department assigned"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Info Section */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    Profile Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Full Name:
                      </span>
                      <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">
                        {profile.firstName} {profile.lastName}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">
                        User ID:
                      </span>
                      <span className="ml-2 font-mono text-gray-800 dark:text-gray-200">
                        {profile.userId}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <div className="space-y-6">
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Edit3 className="w-5 h-5 text-amber-600" />
                    <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                      Edit Profile
                    </h3>
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Update your profile information below. All fields are
                    required.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <User className="w-4 h-4 inline mr-2 text-blue-500" />
                      First Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className={`w-full px-4 py-3 border-2 rounded-xl text-gray-500 transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none ${
                          errors.firstName
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50 dark:bg-red-900/20"
                            : "border-gray-200 dark:border-gray-600 focus:border-blue-500  dark:bg-gray-700"
                        } dark:text-white placeholder-gray-400`}
                        placeholder="Enter your first name"
                        style={{ color: "#333" }}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-2 animate-in slide-in-from-left-1 font-medium">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <User className="w-4 h-4 inline mr-2 text-blue-500" />
                      Last Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none ${
                          errors.lastName
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50 dark:bg-red-900/20"
                            : "border-gray-200 dark:border-gray-600 focus:border-blue-500 bg-white dark:bg-gray-700"
                        } dark:text-white placeholder-gray-400`}
                        placeholder="Enter your last name"
                        style={{ color: "#333" }}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-2 animate-in slide-in-from-left-1 font-medium">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <Mail className="w-4 h-4 inline mr-2 text-green-500" />
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none ${
                          errors.email
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50 dark:bg-red-900/20"
                            : "border-gray-200 dark:border-gray-600 focus:border-green-500 bg-white dark:bg-gray-700"
                        } dark:text-white placeholder-gray-400`}
                        placeholder="Enter your email address"
                        style={{ color: "#333" }}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-2 animate-in slide-in-from-left-1 font-medium">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <Phone className="w-4 h-4 inline mr-2 text-orange-500" />
                      Phone Number *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={profile.phoneNumber}
                        onChange={(e) =>
                          handleInputChange("phoneNumber", e.target.value)
                        }
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none ${
                          errors.phoneNumber
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50 dark:bg-red-900/20"
                            : "border-gray-200 dark:border-gray-600 focus:border-orange-500 bg-white dark:bg-gray-700"
                        } dark:text-white placeholder-gray-400`}
                        placeholder="Enter your phone number"
                        style={{ color: "#333" }}
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-xs mt-2 animate-in slide-in-from-left-1 font-medium">
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Department */}
                  <div className="group md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <Building className="w-4 h-4 inline mr-2 text-purple-500" />
                      Department *
                    </label>
                    <div className="relative">
                      <select
                        value={profile.department}
                        onChange={(e) =>
                          handleInputChange("department", e.target.value)
                        }
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none appearance-none cursor-pointer ${
                          errors.department
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50 dark:bg-red-900/20"
                            : "border-gray-200 dark:border-gray-600 focus:border-purple-500 bg-white dark:bg-gray-700"
                        } dark:text-white`}
                        style={{ color: "#333" }}
                      >
                        <option value="">Select your department</option>
                        <option value="IT">Information Technology</option>
                        <option value="HR">Human Resources</option>
                        <option value="Finance">Finance</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="Operations">Operations</option>
                      </select>
                      {errors.department && (
                        <p className="text-red-500 text-xs mt-2 animate-in slide-in-from-left-1 font-medium">
                          {errors.department}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            {isEditing ? (
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-6 py-2.5 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 flex items-center space-x-2 shadow-lg"
                >
                  {isSaving ? (
                    <>
                      <RefreshCcw className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400"></p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center space-x-2 shadow-lg"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default ProfileModal;
