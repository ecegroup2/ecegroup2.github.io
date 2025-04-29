import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";

import { Phone, MessageCircle, X, AlertCircle } from "lucide-react";
import { useState } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const phoneNumber = "+917047466142";
  const whatsappNumber = "+917047466142";
  const message = "Emergency! Need assistance!";
  const mainButtonColor = "#ff5252";
  const phoneButtonColor = "#4caf50";
  const whatsappButtonColor = "#25D366";

  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Toggle menu visibility with animation
  const toggleExpand = () => {
    setIsAnimating(true);
    setIsExpanded(!isExpanded);

    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isExpanded && !target.closest(".contact-float-container")) {
        setIsExpanded(false);
      }
    };

    // document.addEventListener('click', handleClickOutside);
    // return () => {
    //   document.removeEventListener('click', handleClickOutside);
    // };
  }, [isExpanded]);

  // open the menu when clicking the background
  const openMenu = () => {
    if (isExpanded) {
      setIsExpanded(false);
    }
  };

  // Handle the phone call action
  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${phoneNumber}`;
  };

  // Handle the WhatsApp message action
  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Format the WhatsApp URL with the number and pre-filled message
    const encodedMessage = encodeURIComponent(message);
    window.location.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  };

  return (
    <div className="overflow-x-hidden min-h-screen flex flex-col bg-[#282829] text-white">
      <Navbar />
      <main className="flex-1 w-full px-4 py-6 md:px-6">
        <div className="max-w-screen-xl mx-auto animate-fade-in">
          {children}
        </div>
        {/* Emergency Call and WhatsApp Button */}
        <div className="fixed bottom-8 right-8 z-50 contact-float-container text-black">
          {/* Expanded menu items */}
          {isExpanded && (
            <div
              onClick={openMenu}
              className={`flex flex-col items-end space-y-4 mb-4 ${
                isAnimating ? "animate-fadeIn" : ""
              }`}
            >
              {/* Contact labels */}
              <div className="flex items-center space-x-2 bg-white rounded-lg shadow-lg p-2 mb-1">
                <span className="text-sm font-medium">Contact Us</span>
              </div>

              {/* Phone call button with label */}
              <div className="flex items-center">
                <div className="mr-3 bg-white px-3 py-1 rounded-lg shadow-md">
                  <span className="text-sm font-medium">Call Now</span>
                </div>
                <button
                  onClick={handleCall}
                  className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg transform transition-transform hover:scale-110"
                  style={{ backgroundColor: phoneButtonColor }}
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
              <div className="flex items-center">
                <div className="mr-3 bg-white px-3 py-1 rounded-lg shadow-md">
                  <span className="text-sm font-medium">WhatsApp</span>
                </div>
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg transform transition-transform hover:scale-110"
                  style={{ backgroundColor: whatsappButtonColor }}
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
            className={`flex items-center justify-center w-16 h-16 rounded-full shadow-lg transform transition-all ${
              isExpanded ? "rotate-45" : "hover:scale-110"
            }`}
            style={{ backgroundColor: mainButtonColor }}
            aria-label="Contact options"
          >
            {isExpanded ? (
              <X className="text-white" size={32} />
            ) : (
              <div className="flex flex-col items-center">
                <Phone className="text-white" size={18} />
                <div className="h-0.5 w-6 bg-white my-1"></div>
                <MessageCircle className="text-white" size={18} />
              </div>
            )}
          </button>
        </div>
      </main>
      <footer className="w-full py-4 text-center text-sm text-black px-4 space-y-2">
        <div className="max-w-screen-xl mx-auto">
          <span className="font-bold">Contact:</span>{" "}
          <span
            className="font-semibold cursor-pointer text-slate-300"
            onClick={function sendMail() {
              window.location.href = "mailto:projectimposs@gmail.com";
            }}
          >
            projectimposs@gmail.com
          </span>
        </div>
        <div className="max-w-screen-xl mx-auto">
          © {new Date().getFullYear()} HeartWise. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
// Removed conflicting local useState function
