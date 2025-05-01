import { useState, useEffect } from "react";
import { HeartPulse, ArrowLeft, Calendar, Award, Phone, Cpu, Activity, Zap } from "lucide-react";

export default function IntroductionPage() {
  const [activeTab, setActiveTab] = useState("about");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // ECG Animation Background Component
  const ECGBackground = () => (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <svg className="w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
        <path
          className="ecg-path"
          d="M0,400 Q60,400 90,400 T140,400 T170,200 T200,400 T240,400 T280,400 T320,600 T350,400 T390,400 T420,400 T450,200 T480,400 T520,400 T560,400 T600,600 T640,400 T680,400 T720,400 T760,200 T800,400 T840,400 T880,400 T920,600 T960,400 T1000,400 T1040,400 T1080,200 T1120,400 T1160,400 T1200,400 T1240,600 T1280,400 T1320,400 T1360,400 T1400,200 T1440,400"
          fill="none"
          stroke="#ec4899"
          strokeWidth="3"
          strokeDasharray="2000"
          strokeDashoffset="2000"
        />
      </svg>
    </div>
  );

  function Route(path: string): void {
    window.location.href = path;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated particles/dots */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-pink-500 opacity-70 animate-pulse"></div>
        <div className="absolute top-3/4 left-1/3 h-3 w-3 rounded-full bg-blue-500 opacity-60 animate-pulse"></div>
        <div className="absolute top-2/3 right-1/4 h-2 w-2 rounded-full bg-purple-500 opacity-70 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 h-3 w-3 rounded-full bg-indigo-500 opacity-60 animate-pulse"></div>
        <div className="absolute top-2/5 left-1/2 h-2 w-2 rounded-full bg-cyan-500 opacity-70 animate-pulse"></div>
      </div>

      {/* ECG Background Animation */}
      <ECGBackground />

      {/* Circular gradient effects */}
      <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-gradient-radial from-purple-900/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-radial from-blue-900/20 to-transparent rounded-full blur-3xl"></div>

      <div className={`w-full max-w-4xl z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6 hover:cursor-pointer" onClick={() => Route('/')} >
            <div className="relative">
              <HeartPulse className="h-10 w-10 text-pink-500 animate-pulse" />
              <div className="absolute inset-0 h-10 w-10 bg-pink-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
            </div>
            <span className="font-bold text-4xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
              HealthiFy
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Welcome Back</h1>
          <p className="text-gray-400 text-lg">
            Expert healthcare personalized for your needs
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800 overflow-hidden relative">
          {/* Glow effects */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
          
          <div className="md:flex">
            <div className="md:w-1/3 p-6">
              <div className="h-full flex items-center justify-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="rounded-full overflow-hidden border-4 border-pink-500 h-64 w-64 relative z-10 transition-transform duration-300 transform group-hover:scale-105">
                    <img
                      src="favicon.png"
                      alt="HealthiFy Team"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Team Info Section */}
            <div className="md:w-2/3 p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                    HealthiFy Team
                  </span>
                  <Activity className="h-6 w-6 ml-3 text-pink-500" />
                </h2>
                <p className="text-pink-400 font-medium mb-4 text-lg">
                  Expert Team of Engineers
                </p>
                
                <div className="flex flex-wrap gap-3 mb-5">
                  <span className="bg-gradient-to-r from-pink-600 to-pink-400 bg-opacity-30 text-white px-4 py-1.5 rounded-full text-xs font-medium flex items-center">
                    <Zap className="h-3 w-3 mr-1" />
                    Heart Specialist
                  </span>
                  <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-opacity-30 text-white px-4 py-1.5 rounded-full text-xs font-medium flex items-center">
                    <Activity className="h-3 w-3 mr-1" />
                    ECG Specialist
                  </span>
                  <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-opacity-30 text-white px-4 py-1.5 rounded-full text-xs font-medium flex items-center">
                    <Cpu className="h-3 w-3 mr-1" />
                    ECE Engineer
                  </span>
                </div>
                
                <div className="flex items-center gap-6 text-gray-300 mb-5">
                  <div className="flex items-center gap-2 bg-gray-800 bg-opacity-50 px-3 py-1.5 rounded-lg">
                    <Calendar className="h-4 w-4 text-pink-400" />
                    <span className="text-sm">Available all time</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-800 bg-opacity-50 px-3 py-1.5 rounded-lg">
                    <Phone className="h-4 w-4 text-pink-400" />
                    <span className="text-sm">24/7 Support</span>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-gray-700 mb-6">
                <nav className="flex space-x-8">
                  {["about", "education", "contact"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-2 px-4 border-b-2 font-medium text-sm transition-all duration-300 ${
                        activeTab === tab
                          ? "border-pink-500 text-pink-400 translate-y-0"
                          : "border-transparent text-gray-400 hover:text-gray-300 hover:-translate-y-1"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="text-gray-300 bg-gray-800 bg-opacity-30 p-5 rounded-xl">
                {activeTab === "about" && (
                  <div className="animate-fadeIn">
                    <p className="mb-3 text-justify leading-relaxed">
                      We are a dynamic group of innovators focused on leveraging
                      technology to make healthcare more accessible and
                      efficient. Our current project, the "Smart & Early
                      Abnormality Diagnosis System (IoT-Healthcare)", is an
                      IoT-based health monitoring solution designed for
                      real-time tracking of vital signs like SpO₂, heart rate,
                      BMI, and ECG. By enabling remote patient monitoring, data
                      logging, and early detection of abnormalities, we aim to
                      empower healthcare providers and enhance patient care,
                      especially in rural and underserved communities.
                    </p>
                  </div>
                )}

                {activeTab === "education" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-start gap-4 bg-gray-700 bg-opacity-30 p-3 rounded-lg hover:bg-opacity-40 transition-colors">
                      <Award className="h-8 w-8 text-pink-400 mt-1" />
                      <div>
                        <h3 className="font-medium text-white text-lg">
                          B.Tech in ECE
                        </h3>
                        <p className="text-gray-300">
                          St. Thomas' College of Engineering & Technology, 2021-25
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 bg-gray-700 bg-opacity-30 p-3 rounded-lg hover:bg-opacity-40 transition-colors">
                      <Award className="h-8 w-8 text-pink-400 mt-1" />
                      <div>
                        <h3 className="font-medium text-white text-lg">
                          Residency
                        </h3>
                        <p className="text-gray-300">
                          Kolkata, West Bengal, India
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "contact" && (
                  <div className="space-y-4 animate-fadeIn">
                    {[
                      {
                        name: "Soumik Pal",
                        email: "soumik20020906@gmail.com"
                      },
                      {
                        name: "Premanshu Ray",
                        email: "premanshuray981@gmail.com"
                      },
                      {
                        name: "Ali Hossain Munshi",
                        email: "alihossainmunshi@gmail.com"
                      },
                      {
                        name: "Tushar Koley",
                        email: "frozenkoley2003@gmail.com"
                      }
                    ].map((person, index) => (
                      <div 
                        key={index} 
                        className="flex items-start gap-4 bg-gray-700 bg-opacity-30 p-3 rounded-lg hover:bg-opacity-50 transition-all hover:translate-x-1"
                      >
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-sm text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium text-white text-lg">
                            {person.name}
                          </h3>
                          <div className="flex flex-wrap gap-3 mt-1">
                            <span className="text-blue-400 hover:text-blue-300 transition-colors">
                              {person.email}
                            </span>
                            <span className="text-white">|</span>
                            <span className="text-pink-400 hover:text-pink-300 transition-colors">
                              LinkedIn
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-10 text-center">
          <button onClick={() => Route('/')} className="inline-flex items-center text-gray-400 hover:text-white transition-colors bg-gray-800 bg-opacity-50 px-4 py-2 rounded-lg hover:bg-opacity-70">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to homepage
          </button>
        </div>
      </div>

      {/* Add global styles for animations */}
      <style>{`
        @keyframes ecgAnimate {
          to {
            stroke-dashoffset: 0;
          }
        }
        .ecg-path {
          animation: ecgAnimate 6s linear infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .bg-gradient-radial {
          background-image: radial-gradient(var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}