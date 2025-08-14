import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  MapPin,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Toast } from "@/components/ui";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/components/store/slice/authSlice";
const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [department, setDepartment] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("Male");
  const [accountType, setAccountType] = useState("USER");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    confirmPassword?: string;
    department?: string;
    accountType?: string;
  }>({});
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const navigate = useNavigate();

  const validateEmail = (value: string) => {
    if (!value) return "Email is required";
    const regex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,4}$/;
    if (!regex.test(value)) return "Invalid email format";
    return "";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    const err = validateEmail(val);
    setErrors((prev) => ({ ...prev, email: err || undefined }));
    return;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (val.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
    return;
  };
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = e.target.value;
    setConfirmPassword(val);
    if (val !== password) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
    return;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhoneNumber(val);
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(val)) {
      setErrors((prev) => ({
        ...prev,
        phoneNumber: "Must be 10 digits and start with 0",
      }));
    } else {
      setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
    }
    return;
  };

  const validateAllFields = () => {
    const newErrors: typeof errors = {};

    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (confirmPassword !== password)
      newErrors.confirmPassword = "Passwords do not match";

    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      newErrors.phoneNumber = "Must be 10 digits and start with 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e) => {
  e.preventDefault();
  if (!validateAllFields()) return;

  setLoading(true);
  try {
    const response = await fetch("https://689c2efc58a27b18087d282f.mockapi.io/api/v1/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        department,
        accountType,
        gender,
        address,
      }),
    });

      if (response.ok) {
        const data = await response.json();
        alert(
          `Sign-up successful! User ID: ${data.id}. Redirecting to dashboard...`
        );
        navigate("/login"); // Chuyển hướng sau khi đăng ký thành công
      } else {
        const errorData = await response.json();
        setErrors((prev) => ({
          ...prev,
          form: `Sign-up failed: ${errorData.message || "Please try again."}`,
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        form: "An error occurred. Please try again later.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  setLoading(true);
  try {
    const response = await fetch("https://689c2efc58a27b18087d282f.mockapi.io/api/v1/users/signup");
    
    const users = await response.json();
    
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
        // Set in redux
       const userData = {
        id: user.id,
        email: user.email,
        role: user.accountType,
        firstName: user.firstName,
        };

        dispatch(loginSuccess(userData));
        setToast({
        message: `Sign-in successful! Welcome, ${user.firstName}! Redirecting to dashboard...`,
        type: "success",
      });
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000)
    } else {
        setToast({
          message: "Email or password are incorrect.",
          type: "error",
        });
        setErrors((prev) => ({
          ...prev,
          form: "Email hoặc mật khẩu không đúng.",
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        form: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-4">
              <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
             Job Tracker
          </h1>
          <p className="text-gray-600">Manage your job efficiently</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab("signin")}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "signin"
                  ? "  bg-gray-50 text-blue-700 font-bold"
                  : "text-gray-500 hover:text-gray-700 bg-gray-50"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "signup"
                  ? "text-blue-700 font-bold  bg-gray-50"
                  : "text-gray-500 hover:text-gray-700 bg-gray-50"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {activeTab === "signin" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-gray-600 text-sm">
                {activeTab === "signin"
                  ? "Sign in to your account to continue"
                  : "Join our office seat reservation system"}
              </p>
            </div>

            {activeTab === "signin" ? (
              // Sign In Form
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  {/* Email Field */}
                  <div>
                    <div className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  {/* Password Field */}
                  <div>
                    <div className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    // disabled={loading}
                    className="w-full bg-gray-900 cursor-pointer text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all transform hover:scale-[0.99] active:scale-[0.97]"
                  >
                    {loading ? "Signing In..." : "Sign In"} 
                  </button>
                </div>
              </form>
            ) : (
              // Sign Up Form
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-4">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </div>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div>
                      <div className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </div>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </div>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        placeholder="84+"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div>
                      <div className="block text-sm font-medium text-gray-700 mb-2">
                        Gender <span className="text-red-500">*</span>
                      </div>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>
                  {/* Address Field */}
                  <div>
                    <div className="block text-sm font-medium text-gray-700 mb-2">
                      Address <span className="text-red-500">*</span>
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />{" "}
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Ha Noi, Vietnam"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <div className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="employee@company.com"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Department Dropdown */}
                  <div>
                    <div className="block text-sm font-medium text-gray-700 mb-2">
                      Department <span className="text-red-500">*</span>
                    </div>
                    <div className="relative">
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                        required
                      >
                        <option value="">Select your department</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="HR">Human Resources</option>
                        <option value="Finance">Finance</option>
                        <option value="Operations">Operations</option>
                      </select>

                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Account Type Dropdown */}

                  {/* Password Field */}
                  <div>
                    <div className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <div className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        placeholder="Confirm your password"
                        required
                        className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 cursor-pointer text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all transform hover:scale-[0.99] active:scale-[0.97]"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            )}

            {/* Forgot Password - Only show on Sign In */}
            {activeTab === "signin" && (
              <div className="text-center mt-4">
                <button
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-blue-600 cursor-pointer hover:text-blue-700 font-medium transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-1">
          <p className="text-sm text-gray-500">
            © 2025 Office Seat Reservation System
          </p>
          <div className="flex justify-center items-center gap-2 text-xs text-gray-400">
            <span>Secure</span>
            <span>•</span>
            <span>Efficient</span>
            <span>•</span>
            <span>User-Friendly</span>
          </div>
        </div>
      </div>
      {/* Toast notification */}
                {toast && (
                  <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                    className="max-w-[90%] sm:max-w-sm"
                  />
                )}
    </div>
  );
};

export default LoginPage;