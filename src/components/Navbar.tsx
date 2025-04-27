import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HeartPulse,
  MessageSquare,
  Star,
  Menu,
  Users,
  X,
} from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleSignInClick = () => {
    navigate("/we"); 
    setMobileMenuOpen(false); // Close mobile menu when navigating
  };

  const navLinks = [
    { path: "/", label: "Dashboard", icon: <HeartPulse size={16} /> },
    {
      path: "/chat",
      label: "AI Consultation",
      icon: <MessageSquare size={16} />,
    },
    {
      path: "/prediction",
      label: "Disease Prediction",
      icon: <Star size={16} />, // Changed icon to be consistent
    },
    { path: "/doctors", label: "Find Doctors", icon: <Users size={16} /> },
    { path: "/testimonial", label: "Testimonial", icon: <Star size={16} /> }, // Fixed capitalization
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-[#10152499] backdrop-blur-md shadow-md" : "bg-[#101524]"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <HeartPulse className="h-6 w-6 text-pink-500 animate-pulse" />
          <span className="font-semibold text-xl text-yellow-50">
            HealthiFy
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`border rounded-md py-1 px-3 flex items-center gap-2 text-sm font-medium transition-all hover:text-white hover:shadow-md hover:border-pink-400 ${
                location.pathname === link.path
                  ? "text-[#29c7ac] border-pink-400 font-bold shadow-md"
                  : "text-gray-300 border-transparent"
              }`}
            >
              {link.icon}
              <span className="hidden lg:inline">{link.label}</span>
            </Link>
          ))}

          <button
            onClick={handleSignInClick}
            className="ml-4 bg-pink-600 hover:bg-pink-700 text-white px-4 py-1 rounded-md transition-colors duration-200 font-medium"
          >
            WE
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={handleSignInClick}
            className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200"
          >
            WE
          </button>

          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden px-4 pb-4 pt-2 ${
            scrolled
              ? "bg-[#10152499] backdrop-blur-md shadow-md"
              : "bg-[#101524]"
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
                    : "text-gray-300 hover:text-white hover:bg-[#1c1f2b]"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;