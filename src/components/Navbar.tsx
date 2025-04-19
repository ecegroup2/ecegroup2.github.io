import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HeartPulse, MessageSquare, Users, Star, Menu, X } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const navLinks = [
    { path: "/", label: "Dashboard", icon: <HeartPulse size={18} /> },
    { path: "/chat", label: "AI Consultation", icon: <MessageSquare size={18} /> },
    { path: "/doctors", label: "Find Doctors", icon: <Users size={18} /> },
    { path: "/Testimonial", label: "Testimonial", icon: <Star size={18} /> },
  ];

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
      scrolled ? "bg-[#10152427] backdrop-blur-md shadow-md" : "bg-[#101524]"
    }`}><div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <HeartPulse className="h-6 w-6 text-health-heart animate-pulse-subtle" />
          <span className="font-semibold text-xl text-yellow-50">HealthiFy</span>
        </Link>

        {/* Tablet & Desktop Nav */}
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
              {/* label hidden on md, visible on lg+ */}
              <span className="hidden lg:inline">{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
          {/* ${
       */} 
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden px-4 pb-4 pt-2 ${
          scrolled ? "bg-[#10152427] backdrop-blur-md shadow-md" : "bg-[#101524]"
        }`}>
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
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
