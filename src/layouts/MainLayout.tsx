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
  // const handleWhatsApp = (e) => {
  //   e.stopPropagation();
  //   const encodedMessage = encodeURIComponent(message);
  //   window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');

  // };
  // Handle the WhatsApp message action with location
  // const handleWhatsApp = async (e) => {
  //   e.preventDefault(); // Changed from stopPropagation to prevent default form submission

  //   // Function to send WhatsApp message
  //   const sendWhatsAppMessage = (messageToSend) => {
  //     if (!whatsappNumber) {
  //       alert("Please provide a WhatsApp number.");
  //       return;
  //     }

  //     // Format the number correctly (remove any spaces, dashes, etc.)
  //     const formattedNumber = whatsappNumber.replace(/\D/g, '');

  //     const encodedMessage = encodeURIComponent(messageToSend);
  //     window.open(
  //       `https://wa.me/${formattedNumber}?text=${encodedMessage}`,
  //       '_blank',
  //       'noopener,noreferrer'
  //     );
  //   };

  //   // Try to get user's location
  //   if ("geolocation" in navigator) {
  //     try {
  //       const position = await new Promise<GeolocationPosition>((resolve, reject) => {
  //         navigator.geolocation.getCurrentPosition(
  //           resolve,
  //           reject,
  //           { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  //         );
  //       });

  //       const { latitude, longitude } = position.coords;
  //       const locationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
  //       const messageWithLocation = `${message}\n\nMy Location: ${locationUrl}`;
  //       sendWhatsAppMessage(messageWithLocation);
  //     } catch (error) {
  //       console.error("Geolocation error:", error);

  //       // Provide more specific error messages based on the error code
  //       let errorMessage = "Unable to access your location. ";

  //       if (error.code === 1) {
  //         errorMessage += "Location access was denied. Please grant permission and try again.";
  //       } else if (error.code === 2) {
  //         errorMessage += "Location information is unavailable. Please try again later.";
  //       } else if (error.code === 3) {
  //         errorMessage += "Location request timed out. Please try again.";
  //       }

  //       alert(errorMessage);

  //       if (confirm("Would you like to send your message without location?")) {
  //         sendWhatsAppMessage(message);
  //       }
  //     }
  //   } else {
  //     alert("Geolocation is not supported by your browser.");
  //     if (confirm("Would you like to send your message without location?")) {
  //       sendWhatsAppMessage(message);
  //     }
  //   }
  // };

  // Enhanced multi-source location retrieval for maximum accuracy
  const defaultMessage = "Emergency! Need assistance!";
  const getAccurateLocation = async (lat, lon) => {
    try {
      // Define a function to get a "raw" location string with just coordinates
      const getRawLocation = () => {
        return `Location Coordinates: ${lat.toFixed(6)}, ${lon.toFixed(6)}`;
      };

      // Try multiple location services in parallel for the best result
      const locationPromises = [
        // 1. Try BigDataCloud reverse geocoding API (free tier with generous limits)
        fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        )
          .then((res) => res.json())
          .then((data) => {
            if (!data || data.status === "failed") return null;

            // Build a clean address from BigDataCloud response
            const components = [];
            if (data.locality) components.push(data.locality);
            if (data.city) components.push(data.city);
            if (
              data.principalSubdivision &&
              data.principalSubdivision !== data.city
            )
              components.push(data.principalSubdivision);
            if (data.countryName) components.push(data.countryName);

            const address = components.join(", ");
            return address || null;
          })
          .catch(() => null),

        // 2. Try OpenStreetMap Nominatim as backup
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&zoom=18`
        )
          .then((res) => res.json())
          .then((data) => {
            if (!data || !data.address) return null;

            // Extract key components from OSM response
            const address = data.address;
            const components = [];

            // Add the most specific components first
            if (address.road || address.street)
              components.push(address.road || address.street);
            if (address.suburb || address.neighbourhood)
              components.push(address.suburb || address.neighbourhood);
            if (address.city || address.town || address.village)
              components.push(address.city || address.town || address.village);
            if (address.state || address.county)
              components.push(address.state || address.county);
            if (address.country) components.push(address.country);

            return components.length > 0
              ? components.join(", ")
              : data.display_name || null;
          })
          .catch(() => null),

        // 3. Try direct W3W API integration (what3words - divides world into 3m squares with unique 3 word combinations)
        // Note: This is a mock implementation as actual W3W API requires a key
        fetch(
          `https://api.what3words.com/v3/convert-to-3wa?coordinates=${lat},${lon}&key=YOUR_W3W_API_KEY_HERE`
        )
          .then((res) => res.json())
          .then((data) => {
            if (!data || !data.words) return null;
            // This would return the 3-word address if API was properly configured
            return `what3words: ${data.words}`;
          })
          .catch(() => null),
      ];

      // Wait for all location services to respond
      const locationResults = await Promise.all(locationPromises);

      // Filter out null results and get the best available location
      const validLocations = locationResults.filter((loc) => loc !== null);

      // Create a comprehensive location description
      if (validLocations.length > 0) {
        // Start with the most detailed location we could find
        let bestLocation = validLocations[0];

        // If multiple services returned data, combine their results
        if (validLocations.length > 1) {
          // Use the longest result as it's likely most detailed
          const longestResult = validLocations.reduce((prev, current) => {
            return current && current.length > prev.length ? current : prev;
          }, "");

          bestLocation = longestResult;
        }

        return bestLocation;
      }

      // If all services failed, return a raw coordinate string
      return getRawLocation();
    } catch (err) {
      console.error("Error getting location:", err);
      // Even if everything fails, return the raw coordinates
      return `Location Coordinates: ${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    }
  };

  // Enhanced WhatsApp message with alternative map links and more robust location determination
  const handleWhatsApp = async (e) => {
    e.stopPropagation();

    if (navigator.geolocation) {
      try {
        // Show loading indicator
        const loadingToast = showToast("Getting your precise location...");

        // Try to get high accuracy location with timeout
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            // First try with high accuracy
            const highAccuracyOptions = {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 0,
            };

            let highAccuracyAttemptTimedOut = false;

            // Start high accuracy attempt
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                // If we got a high accuracy result, use it
                if (!highAccuracyAttemptTimedOut) {
                  hideToast(loadingToast);
                  resolve(pos);
                }
                // Otherwise the low accuracy fallback was already used
              },
              (err) => {
                // If permission denied, reject immediately
                if (err.code === err.PERMISSION_DENIED) {
                  hideToast(loadingToast);
                  reject(err);
                }

                // Otherwise, if it's a timeout or unavailable, we'll try low accuracy as fallback
                highAccuracyAttemptTimedOut = true;
              },
              highAccuracyOptions
            );

            // If high accuracy fails, try with lower accuracy as fallback
            setTimeout(() => {
              if (highAccuracyAttemptTimedOut) {
                showToast("Using standard accuracy location...");
                navigator.geolocation.getCurrentPosition(
                  resolve, // Accept whatever we get
                  reject, // If this also fails, we give up
                  {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: 60000, // Allow slightly older cache
                  }
                );
              }
            }, 16000); // Wait just after high accuracy timeout
          }
        );

        // Successfully got position
        const { latitude, longitude } = position.coords;
        const accuracy = position.coords.accuracy; // Get accuracy in meters

        // Get location name from multiple services
        showToast("Finding your address...");
        const locationName = await getAccurateLocation(latitude, longitude);
        hideToast(loadingToast);

        // Create alternative map links (not just Google Maps)
        const googleMapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        const openStreetMapLink = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=18`;
        const waze = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;

        // Define a default message for WhatsApp
        const defaultMessage = "Emergency! Need assistance!";

        // Create a detailed message with multiple map options
        const locationMessage = `${defaultMessage}\n\n📍 MY CURRENT LOCATION:\n${locationName}\n\nPrecise Coordinates: ${latitude.toFixed(
          6
        )}, ${longitude.toFixed(6)}\nAccuracy: ${Math.round(
          accuracy
        )} meters\n\n📱 MAP LINKS (click to open):\n• Google Maps: ${googleMapsLink}\n• Waze: ${waze}\n• OpenStreetMap: ${openStreetMapLink}`;

        const encodedMessage = encodeURIComponent(locationMessage);
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
      } catch (error) {
        // hideToast(loadingToast);
        // Handle specific geolocation errors
        let errorMessage = "Could not determine your location.";

        if (error.code) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Location access was denied. Please enable location services in your browser settings and try again.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage =
                "Location information is unavailable. Please try again in a different area or on a different device.";
              break;
            case error.TIMEOUT:
              errorMessage =
                "Location request timed out. Please check your internet connection and try again.";
              break;
          }
        }

        const fallbackMessage = `${defaultMessage}\n\n⚠️ ${errorMessage}\n\nPlease describe your location manually or try again.`;
        const encodedMessage = encodeURIComponent(fallbackMessage);
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
      }
    } else {
      // Geolocation not supported by the browser
      const fallbackMessage = `${defaultMessage}\n\n⚠️ Your browser doesn't support automatic location services.\n\nPlease describe your location manually.`;
      const encodedMessage = encodeURIComponent(fallbackMessage);
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
    }
  };

  // Simple toast notification system
  const showToast = (message) => {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "toast-container";
      toastContainer.style.cssText =
        "position:fixed;bottom:20px;left:20px;z-index:9999;";
      document.body.appendChild(toastContainer);
    }

    // Create the toast
    const toast = document.createElement("div");
    const toastId = "toast-" + Date.now();
    toast.id = toastId;
    toast.style.cssText =
      "background-color:rgba(0,0,0,0.8);color:white;padding:12px 16px;border-radius:8px;margin-top:10px;display:flex;align-items:center;box-shadow:0 4px 12px rgba(0,0,0,0.15);max-width:400px;";

    // Add spinner
    const spinner = document.createElement("div");
    spinner.style.cssText =
      "width:16px;height:16px;border:2px solid white;border-top:2px solid transparent;border-radius:50%;animation:spin 1s linear infinite;margin-right:10px;";

    // Add keyframes for spinner animation if not already added
    if (!document.getElementById("spinner-keyframes")) {
      const style = document.createElement("style");
      style.id = "spinner-keyframes";
      style.innerHTML =
        "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }";
      document.head.appendChild(style);
    }

    // Add message
    const text = document.createElement("span");
    text.textContent = message;

    toast.appendChild(spinner);
    toast.appendChild(text);

    // Add to container
    toastContainer.appendChild(toast);

    return toastId;
  };

  const hideToast = (toastId) => {
    if (toastId) {
      const toast = document.getElementById(toastId);
      if (toast) {
        toast.remove();
      }
    } else {
      // Hide all toasts if no ID specified
      const container = document.getElementById("toast-container");
      if (container) {
        container.innerHTML = "";
      }
    }
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

      {/*Footer */}
      <footer className="w-full py-6 px-6 bg-gradient-to-b from-gray-900/80 to-gray-900 backdrop-blur-xl border-t border-white/10">
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