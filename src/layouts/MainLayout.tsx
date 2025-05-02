import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Phone, MessageCircle, X, Heart, Mail } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const phoneNumber = "+917047466142";
  const whatsappNumber = "+917047466142";
  const message = "Emergency! Need assistance!";

  // Toggle menu visibility with animation
  const toggleExpand = () => {
    setIsAnimating(true);
    setIsExpanded(!isExpanded);

    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  // Handle the phone call action
  const handleCall = (e) => {
    e.stopPropagation();
    window.location.href = `tel:${phoneNumber}`;
  };

  // Handle the WhatsApp message action
  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const encodedMessage = encodeURIComponent(message);
    window.location.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Navbar />

      <main className="flex-1 w-full px-4 py-6 md:px-8">
        <div className="max-w-screen-2xl mx-auto animate-fade-in">
          {children}
        </div>

        {/* Improved Emergency Contact Floating Menu */}
        <div className="fixed bottom-8 right-8 z-50 contact-float-container">
          {/* Expanded menu items */}
          {isExpanded && (
            <div
              className={`flex flex-col items-end space-y-4 mb-4 ${
                isAnimating ? "animate-fadeIn" : ""
              }`}
            >
              {/* Main label */}
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-3 border border-white/20">
                <Heart className="text-rose-500" size={16} />
                <span className="text-sm font-medium text-white">
                  Emergency Contact
                </span>
              </div>

              {/* Phone call button with label */}
              <div className="group flex items-center transition-all duration-300 ease-in-out">
                <div className="mr-3 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 rounded-lg shadow-md">
                  <span className="text-sm font-semibold text-white">
                    Call Now
                  </span>
                </div>
                <button
                  onClick={handleCall}
                  className="relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 transform transition-all duration-300 hover:scale-110 border-2 border-emerald-400/30"
                  aria-label="Call us"
                >
                  <Phone className="text-white" size={24} />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
                  </span>
                </button>
              </div>

              {/* WhatsApp button with label */}
              <div className="group flex items-center transition-all duration-300 ease-in-out">
                <div className="mr-3 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 rounded-lg shadow-md">
                  <span className="text-sm font-semibold text-white">
                    WhatsApp
                  </span>
                </div>
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center w-16 h-16 rounded-full shadow-2xl bg-gradient-to-r from-green-500 to-green-600 transform transition-all duration-300 hover:scale-110 border-2 border-green-400/30"
                  aria-label="Message on WhatsApp"
                >
                  <MessageCircle className="text-white" size={24} />
                </button>
              </div>
            </div>
          )}

          {/* Main floating button */}
          <button
            onClick={toggleExpand}
            className={`flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transform transition-all duration-300 ${
              isExpanded
                ? "rotate-45 bg-rose-600"
                : "hover:scale-110 bg-gradient-to-r from-rose-500 to-rose-600"
            } border-2 border-rose-400/30`}
            aria-label="Contact options"
          >
            {isExpanded ? (
              <X className="text-white" size={28} />
            ) : (
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Phone className="text-white" size={20} />
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-white animate-pulse"></span>
                </div>
                <div className="h-0.5 w-6 bg-white/70 my-1"></div>
                <MessageCircle className="text-white" size={20} />
              </div>
            )}
          </button>
        </div>
      </main>

      {/* Footer */}

      <footer className="w-full py-7 px-6 bg-gradient-to-b from-gray-900/80 to-gray-900 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-screen-xl mx-auto">
          {/* Main Content */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Branding */}
            <div className="group flex items-center mb-4 md:mb-0 hover:scale-105 transition-transform">
              <Heart className="text-rose-500 mr-3 animate-pulse" size={24} />
              <span className="text-xl font-extrabold bg-gradient-to-r from-rose-400 via-red-500 to-pink-600 bg-clip-text text-transparent">
                HeartWise
              </span>
            </div>

            {/* Contact Section */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex items-center group">
                <Mail
                  className="text-rose-400 mr-2 group-hover:animate-bounce"
                  size={18}
                />
                <button
                  className="font-medium text-gray-300 hover:text-rose-300 transition-colors duration-300"
                  onClick={() =>
                    (window.location.href = "mailto:projectimposs@gmail.com")
                  }
                >
                  projectimposs@gmail.com
                </button>
              </div>

              <div className="flex items-center group">
                <Phone
                  className="text-rose-400 mr-2 group-hover:animate-spin"
                  size={18}
                />
                <button
                  className="font-medium text-gray-300 hover:text-rose-300 transition-colors duration-300"
                  onClick={() => (window.location.href = `tel:${phoneNumber}`)}
                >
                  {phoneNumber}
                </button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-gray-400/90 tracking-wide">
              © {new Date().getFullYear()} HeartWise. All rights reserved.
              <span className="block mt-2 text-xs text-gray-500/70">
                Crafted with <span className="text-rose-500">❤️</span> for
                better health solutions
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
