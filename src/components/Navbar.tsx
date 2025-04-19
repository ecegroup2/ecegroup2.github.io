import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HeartPulse,
  MessageSquare,
  Users,
  Star,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  // Check authentication status when component mounts and when location changes
  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const checkAuthStatus = () => {
    const userData = localStorage.getItem("healthifyUser");
    if (userData) {
      const user = JSON.parse(userData);
      if (user.isAuthenticated) {
        setIsAuthenticated(true);
        setUserName(user.name || "User");
      } else {
        setIsAuthenticated(false);
        setUserName("");
      }
    } else {
      setIsAuthenticated(false);
      setUserName("");
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleSignInClick = () => {
    navigate("/auth");
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("healthifyUser");
    setIsAuthenticated(false);
    setUserName("");
    setMobileMenuOpen(false);
    
    // Optional: Navigate to home page
    navigate("/");
  };

  const navLinks = [
    { path: "/", label: "Dashboard", icon: <HeartPulse size={18} /> },
    { path: "/chat", label: "AI Consultation", icon: <MessageSquare size={18} /> },
    { path: "/doctors", label: "Find Doctors", icon: <Users size={18} /> },
    { path: "/Testimonial", label: "Testimonial", icon: <Star size={18} /> },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-[#10152427] backdrop-blur-md shadow-md" : "bg-[#101524]"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <HeartPulse className="h-6 w-6 text-health-heart animate-pulse-subtle" />
          <span className="font-semibold text-xl text-yellow-50">HealthiFy</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`border rounded-md py-1 px-3 flex items-center gap-2 text-sm font-medium transition-all hover:text-white hover:shadow-md hover:border-pink-400 ${
                location.pathname === link.path
                  ? "text-[#29c7ac] font-extrabold shadow-md scale-105"
                  : "text-muted-foreground"
              }`}
            >
              {link.icon}
              <span className="hidden lg:inline">{link.label}</span>
            </Link>
          ))}

          {/* Auth Buttons - Desktop */}
          {isAuthenticated ? (
            <div className="flex items-center ml-4">
              <div className="text-yellow-50 mr-4 hidden lg:block">
                Welcome, {userName}
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition flex items-center gap-2"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignInClick}
              className="ml-4 bg-pink-600 text-white px-4 py-1 rounded hover:bg-pink-700 transition"
            >
              Sign In
            </button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          {isAuthenticated ? (
            <span className="text-yellow-50 text-sm mr-2">
              Hi, {userName}
            </span>
          ) : null}
          
          <button
            onClick={isAuthenticated ? handleLogout : handleSignInClick}
            className={`flex items-center justify-center ${isAuthenticated ? "text-red-400" : "text-white"}`}
            title={isAuthenticated ? "Logout" : "Sign In"}
          >
            {isAuthenticated ? <LogOut size={22} /> : <User size={24} />}
          </button>

          <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden px-4 pb-4 pt-2 ${
            scrolled ? "bg-[#10152427] backdrop-blur-md shadow-md" : "bg-[#101524]"
          }`}
        >
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-2 rounded-md transition-all ${
                  location.pathname === link.path
                    ? "bg-[#1d2a3a] text-[#29c7ac] font-semibold"
                    : "text-muted-foreground hover:text-white hover:bg-[#1c1f2b]"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
            
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 p-2 bg-red-600 bg-opacity-80 text-white rounded hover:bg-red-700 transition"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  handleSignInClick();
                  setMobileMenuOpen(false);
                }}
                className="bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;