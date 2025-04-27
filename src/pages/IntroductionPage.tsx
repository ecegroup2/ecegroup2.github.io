import { useState } from "react";
import { Link } from "react-router-dom";
import { HeartPulse, ArrowLeft, Calendar, Award, Phone } from "lucide-react";

const IntroductionPage = () => {
  const [activeTab, setActiveTab] = useState<"about" | "education" | "contact">(
    "about"
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#101524] to-[#1d2a3a] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <HeartPulse className="h-8 w-8 text-pink-500 animate-pulse-subtle" />
            <span className="font-bold text-3xl text-yellow-50">HealthiFy</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">
            Expert healthcare personalized for your needs
          </p>
        </div>

        {/* Doctor Profile Card */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="md:flex">
            {/* Doctor Image Section */}
            <div className="md:w-1/3">
              <div className="h-full flex items-center justify-center p-6">
                <div className="rounded-full overflow-hidden border-4 border-pink-500 h-64 w-64">
                  <img
                    src="favicon.png"
                    alt="Doctor"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* Doctor Info Section */}
            <div className="md:w-2/3 p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">
                  HealthiFy Team
                </h2>
                <p className="text-pink-400 font-medium mb-3">
                  Expert Team of Engineers
                </p>
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="bg-pink-500 bg-opacity-20 text-pink-300 px-3 py-1 rounded-full text-xs font-medium">
                    Heart Specialist
                  </span>
                  <span className="bg-purple-500 bg-opacity-20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium">
                    ECG Specialist
                  </span>
                  <span className="bg-blue-500 bg-opacity-20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                    ECE Engineer
                  </span>
                </div>
                <div className="flex items-center gap-6 text-gray-300 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-pink-400" />
                    <span className="text-sm">Available all time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-pink-400" />
                    <span className="text-sm">24/7 Support</span>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-gray-700 mb-4">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab("about")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === "about"
                        ? "border-pink-500 text-pink-400"
                        : "border-transparent text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    About
                  </button>
                  <button
                    onClick={() => setActiveTab("education")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === "education"
                        ? "border-pink-500 text-pink-400"
                        : "border-transparent text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    Education
                  </button>
                  <button
                    onClick={() => setActiveTab("contact")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === "contact"
                        ? "border-pink-500 text-pink-400"
                        : "border-transparent text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    Contact
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="text-gray-300">
                {activeTab === "about" && (
                  <div>
                    <p className="mb-3 text-justify">
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
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-pink-400 mt-1" />
                      <div>
                        <h3 className="font-medium text-white">
                          B.Tech in ECE
                        </h3>
                        <p className="text-sm">
                          St. Thomas' College of Engineering & Technology,
                          2021-25
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-pink-400 mt-1" />
                      <div>
                        <h3 className="font-medium text-white">Residency</h3>
                        <p className="text-sm">Kolkata,West Bengal,Inida</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "contact" && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-pink-400 mt-1 flex items-center justify-center text-xs text-white">
                        1
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Soumik Pal</h3>
                        <p className="text-sm">
                          <span
                            className="text-blue-500 hover:cursor-pointer"
                            onClick={function sendMail() {
                              window.location.href =
                                "mailto:soumik20020906@gmail.com";
                            }}
                          >
                            soumik20020906@gmail.com
                          </span>{" "}
                          <span className="font-bold">|</span>{" "}
                          <span
                            className="text-blue-300 hover:cursor-pointer"
                            onClick={function sendmeassage() {
                              window.location.href =
                                "https://www.linkedin.com/in/soumik-pal-676924228 ";
                            }}
                          >
                            LinkedIn
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-pink-400 mt-1 flex items-center justify-center text-xs text-white">
                        2
                      </div>
                      <div>
                        <h3 className="font-medium text-white">
                          Premanshu Ray
                        </h3>
                        <p className="text-sm">
                          <span
                            className="text-blue-500 hover:cursor-pointer"
                            onClick={function sendMail() {
                              window.location.href =
                                "mailto:premanshuray981@gmail.com";
                            }}
                          >
                            premanshuray981@gmail.com
                          </span>{" "}
                          <span className="font-bold">|</span>{" "}
                          <span
                            className="text-blue-300 hover:cursor-pointer"
                            onClick={function sendmeassage() {
                              window.location.href =
                                "https://www.linkedin.com/in/premanshuray/";
                            }}
                          >
                            LinkedIn
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-pink-400 mt-1 flex items-center justify-center text-xs text-white">
                        3
                      </div>
                      <div>
                        <h3 className="font-medium text-white">
                          Ali Hossain Munshi
                        </h3>
                        <p className="text-sm">
                          <span
                            className="text-blue-500 hover:cursor-pointer"
                            onClick={function sendMail() {
                              window.location.href =
                                "mailto:alihossainmunshi@gmail.com";
                            }}
                          >
                            alihossainmunshi@gmail.com
                          </span>
                          <span className="font-bold"> | </span>{" "}
                          <span
                            className="text-blue-300 hover:cursor-pointer"
                            onClick={function sendmeassage() {
                              window.location.href =
                                "https://www.linkedin.com/in/ali-hossain-munshi-34362a234";
                            }}
                          >
                            LinkedIn
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-pink-400 mt-1 flex items-center justify-center text-xs text-white">
                        3
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Tushar Koley</h3>
                        <p className="text-sm">
                          <span
                            className="text-blue-500 hover:cursor-pointer"
                            onClick={function sendMail() {
                              window.location.href =
                                "mailto:frozenkoley2003@gmail.com";
                            }}
                          >
                            frozenkoley2003@gmail.com
                          </span>{" "}
                          <span className="font-bold">|</span>{" "}
                          <span
                            className="text-blue-300 hover:cursor-pointer"
                            onClick={function sendmeassage() {
                              window.location.href =
                                "https://www.linkedin.com/in/tushar-koley-704014246";
                            }}
                          >
                            LinkedIn
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
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

export default IntroductionPage;
