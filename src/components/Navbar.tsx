
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HeartPulse, MessageSquare, Users, Star } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { path: "/", label: "Dashboard", icon: <HeartPulse size={18} /> },
    { path: "/chat", label: "AI Consultation", icon: <MessageSquare size={18} /> },
    { path: "/doctors", label: "Find Doctors", icon: <Users size={18} /> },
    { path: "/Testimonial", label: "Testimonial", icon: <Star size={18} /> }
  ];

  return (
    <header 
    className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-[#10152427] backdrop-blur-md shadow-md" : "bg-[#101524]"}`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <HeartPulse className="h-6 w-6 text-health-heart animate-pulse-subtle" />
          <span className="font-semibold text-xl text-yellow-50">HealthiFy</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`bg-black border rounded-md py-1 px-3 flex items-center gap-2 text-sm font-medium transition-all hover:text-white hover:transition-colors-duration-200 hover:shadow-md hover:border-pink-400 hover:text-md ${
                location.pathname === link.path
                   ? "text-[#29c7ac] font-extrabold text-md shadow-md scale-105"
                  : "text-muted-foreground"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="md:hidden flex items-center">
          <div className="flex gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center justify-center p-2 rounded-full ${
                  location.pathname === link.path
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground"
                }`}
                aria-label={link.label}
              >
                {link.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
