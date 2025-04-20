import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HeartPulse,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

interface FormData {
  name: string;
  email: string;
  password: string;
}

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // For password field, limit to 10 characters
    if (name === "password" && value.length > 10) {
      return; // Ignore input if already at 10 characters
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password" && !isLogin) {
      const strength = evaluatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const evaluatePasswordStrength = (password: string) => {
    let strength = "Weak";
    // Updated regex to include max length of 10
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,10}$/;
    const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,10}$/;

    if (strongRegex.test(password)) strength = "Strong";
    else if (mediumRegex.test(password)) strength = "Medium";

    return strength;
  };

  // Get strength percentage for progress bar
  const getStrengthPercentage = () => {
    switch (passwordStrength) {
      case "Strong":
        return 100;
      case "Medium":
        return 66;
      case "Weak":
        return 33;
      default:
        return 0;
    }
  };

  // Get color based on strength
  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "Strong":
        return "bg-green-500";
      case "Medium":
        return "bg-yellow-500";
      case "Weak":
        return "bg-red-500";
      default:
        return "bg-gray-600";
    }
  };

  // Check if password meets specific requirements
  const hasLowercase = (password: string) => /[a-z]/.test(password);
  const hasUppercase = (password: string) => /[A-Z]/.test(password);
  const hasNumber = (password: string) => /\d/.test(password);
  const hasSpecialChar = (password: string) => /[\W_]/.test(password);
  const hasValidLength = (password: string) =>
    password.length >= 8 && password.length <= 10;

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      // Login form handling
      if (formData.email && formData.password) {
        // In a real app, you'd validate credentials against a backend
        // For demo, simulate successful login

        // Save user info to localStorage to maintain session
        const userData = {
          isAuthenticated: true,
          email: formData.email,
          name: "User", // In a real app, you'd get the name from the server
        };
        localStorage.setItem("healthifyUser", JSON.stringify(userData));

        toast.success("Successfully signed in!");
        // Set a shorter timeout for better UX
        setTimeout(() => navigate("/"), 1500);
      } else {
        toast.error("Please enter email and password");
      }
    } else {
      // Registration form handling
      if (formData.name && formData.email && formData.password) {
        if (passwordStrength === "Weak") {
          toast.warning("Please choose a stronger password");
          return;
        }

        // Save user info to localStorage with the actual name
        const userData = {
          isAuthenticated: true,
          email: formData.email,
          name: formData.name,
        };
        localStorage.setItem("healthifyUser", JSON.stringify(userData));

        toast.success("Account created successfully!");
        // Route directly to the homepage after successful registration
        setTimeout(() => navigate("/"), 1500);
      } else {
        toast.error("Please fill in all fields");
      }
    }
  };

  // Function to handle Google login success
  const handleGoogleLoginSuccess = (credentialResponse: any) => {
    // In a real app, you'd verify the token on your backend
    // For demo purposes, simulate a successful login

    const userData = {
      isAuthenticated: true,
      email: "google-user@example.com", // In a real app, you'd decode the JWT to get this
      name: "Google User", // In a real app, you'd get the name from the token
    };
    localStorage.setItem("healthifyUser", JSON.stringify(userData));

    toast.success("Google login successful!");
    setTimeout(() => navigate("/"), 1500);
  };

  // Function to switch between login and signup
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setPasswordStrength(""); // Reset strength
    setFormData({ name: "", email: "", password: "" }); // Reset form fields for better UX
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#101524] to-[#1d2a3a] flex items-center justify-center px-4 py-12">
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <HeartPulse className="h-8 w-8 text-pink-500 animate-pulse-subtle" />
            <span className="font-bold text-2xl text-yellow-50">HealthiFy</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-400">
            {isLogin
              ? "Sign in to access your HealthiFy account"
              : "Join HealthiFy for personalized healthcare"}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 w-full pl-10 pr-10 py-2 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder={
                    isLogin
                      ? "Enter your password"
                      : "Create a password (8-10 chars)"
                  }
                  maxLength={10}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Character count display */}
              {!isLogin && (
                <div className="flex justify-end mt-1">
                  <span
                    className={`text-xs ${
                      formData.password.length > 0 &&
                      formData.password.length < 8
                        ? "text-red-400"
                        : formData.password.length >= 8
                        ? "text-green-400"
                        : "text-gray-400"
                    }`}
                  >
                    {formData.password.length}/10 characters
                  </span>
                </div>
              )}

              {/* Password Strength Indicator - Only show when creating account */}
              {!isLogin && formData.password && (
                <div className="mt-3 space-y-2">
                  {/* Strength Bar */}
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                      style={{ width: `${getStrengthPercentage()}%` }}
                    ></div>
                  </div>

                  {/* Strength Label */}
                  <div className="flex justify-between items-center">
                    <p
                      className={`text-sm font-medium ${
                        passwordStrength === "Strong"
                          ? "text-green-400"
                          : passwordStrength === "Medium"
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      Password Strength: {passwordStrength}
                    </p>
                    <span
                      className={`text-xs ${
                        passwordStrength === "Strong"
                          ? "text-green-400"
                          : passwordStrength === "Medium"
                          ? "text-yellow-400"
                          : "text-gray-400"
                      }`}
                    >
                      {passwordStrength === "Strong"
                        ? "Very secure!"
                        : passwordStrength === "Medium"
                        ? "Could be stronger"
                        : "Not secure enough"}
                    </span>
                  </div>

                  {/* Password Requirements Checklist */}
                  <div className="bg-gray-800 bg-opacity-30 p-3 rounded-lg mt-2">
                    <p className="text-xs text-gray-300 mb-2">
                      Password must have:
                    </p>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-center">
                        {hasLowercase(formData.password) ? (
                          <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-400 mr-2" />
                        )}
                        <span
                          className={
                            hasLowercase(formData.password)
                              ? "text-green-400"
                              : "text-gray-400"
                          }
                        >
                          Lowercase letter
                        </span>
                      </li>
                      <li className="flex items-center">
                        {hasUppercase(formData.password) ? (
                          <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-400 mr-2" />
                        )}
                        <span
                          className={
                            hasUppercase(formData.password)
                              ? "text-green-400"
                              : "text-gray-400"
                          }
                        >
                          Uppercase letter
                        </span>
                      </li>
                      <li className="flex items-center">
                        {hasNumber(formData.password) ? (
                          <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-400 mr-2" />
                        )}
                        <span
                          className={
                            hasNumber(formData.password)
                              ? "text-green-400"
                              : "text-gray-400"
                          }
                        >
                          Number
                        </span>
                      </li>
                      <li className="flex items-center">
                        {hasSpecialChar(formData.password) ? (
                          <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-400 mr-2" />
                        )}
                        <span
                          className={
                            hasSpecialChar(formData.password)
                              ? "text-green-400"
                              : "text-gray-400"
                          }
                        >
                          Special character (!@#$%^&*...)
                        </span>
                      </li>
                      <li className="flex items-center">
                        {hasValidLength(formData.password) ? (
                          <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-400 mr-2" />
                        )}
                        <span
                          className={
                            hasValidLength(formData.password)
                              ? "text-green-400"
                              : "text-gray-400"
                          }
                        >
                          Between 8-10 characters
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-pink-400 hover:text-pink-300"
                >
                  Forgot your password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2 rounded-lg font-medium transition-all hover:from-pink-700 hover:to-purple-700 focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#1d2a3a] px-2 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="w-full">
                  <GoogleOAuthProvider clientId="964095254128-fhk44pl70tgoaa1jcnd9ft489t3tm6tp.apps.googleusercontent.com">
                    <GoogleLogin
                      onSuccess={handleGoogleLoginSuccess}
                      onError={() => {
                        toast.error("Google login failed. Please try again.");
                      }}
                      useOneTap
                      theme="outline"
                      size="large"
                      width="100%"
                    />
                  </GoogleOAuthProvider>
                </div>
              </div>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="ml-2 text-pink-400 hover:text-pink-300 font-medium"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
