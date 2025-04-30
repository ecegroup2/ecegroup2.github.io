import MainLayout from "@/layouts/MainLayout";
import { useState, useEffect } from "react";

// Define a type for our results
type VitalSignsResult = {
  heartRate: {
    status: string;
    message: string;
  };
  spo2: {
    status: string;
    message: string;
  };
  summary: {
    urgencyLevel: string;
    recommendations: string[];
  };
  timestamp: string;
};

// Define the global jspdf interface
declare global {
  interface Window {
    jspdf: {
      jsPDF: new () => any;
    };
  }
}

export default function VitalSignsMonitor() {
  const [heartRate, setHeartRate] = useState<number | undefined>(undefined);
  const [spo2, setSpo2] = useState<number | undefined>(undefined);
  const [results, setResults] = useState<VitalSignsResult | null>(null);
  const [error, setError] = useState("");
  const [jsPdfLoaded, setJsPdfLoaded] = useState(false);

  // Load jsPDF library on component mount
  useEffect(() => {
    const loadJsPdf = async () => {
      if (!window.jspdf) {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        script.async = true;

        script.onload = () => {
          setJsPdfLoaded(true);
        };

        script.onerror = () => {
          console.error("Failed to load jsPDF library");
          setError("PDF library failed to load. PDF export may not work.");
        };

        document.body.appendChild(script);
      } else {
        setJsPdfLoaded(true);
      }
    };

    loadJsPdf();

    // Clean up function
    return () => {
      const scriptElement = document.querySelector(
        'script[src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"]'
      );
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
    };
  }, []);

  const validateAndSetHeartRate = (value: string) => {
    if (value === "") {
      setHeartRate(undefined);
      setError("");
      // Clear results when input changes
      setResults(null);
      return;
    }

    const hr = Number(value);
    if (isNaN(hr)) {
      setError("Heart rate must be a number");
      return;
    }
    if (hr > 240) {
      setError("Heart Rate cannot exceed 240 BPM");
      return;
    }
    setHeartRate(hr);
    setError("");
    // Clear results when input changes
    setResults(null);
  };

  const validateAndSetSpo2 = (value: string) => {
    if (value === "") {
      setSpo2(undefined);
      setError("");
      // Clear results when input changes
      setResults(null);
      return;
    }

    const o2 = Number(value);
    if (isNaN(o2)) {
      setError("SpO2 must be a number");
      return;
    }
    if (o2 > 100) {
      setError("SpO2 cannot exceed 100%");
      return;
    }
    setSpo2(o2);
    setError("");
    // Clear results when input changes
    setResults(null);
  };

  const checkHeartRate = (hr: number) => {
    if (hr < 60) {
      return {
        status: "Bradycardia",
        message: "Heart rate below 60 BPM indicates bradycardia.",
      };
    } else if (hr > 95) {
      return {
        status: "Tachycardia",
        message: "Heart rate above 95 BPM indicates tachycardia.",
      };
    } else {
      return {
        status: "Normal",
        message: "Heart rate is within normal range.",
      };
    }
  };

  const checkSpO2 = (o2: number) => {
    if (o2 >= 95) {
      return {
        status: "Normal",
        message: "SpO2 level is normal.",
      };
    } else if (o2 >= 90 && o2 < 95) {
      return {
        status: "Mild Hypoxemia",
        message: "SpO2 between 90% and 95% indicates mild hypoxemia.",
      };
    } else if (o2 >= 85 && o2 < 90) {
      return {
        status: "Moderate Hypoxemia",
        message: "SpO2 between 85% and 90% indicates moderate hypoxemia.",
      };
    } else if (o2 >= 80 && o2 < 85) {
      return {
        status: "Severe Hypoxemia",
        message:
          "SpO2 between 80% and 85% indicates hypoxemia that requires medical attention.",
      };
    } else {
      return {
        status: "Critical Hypoxemia",
        message:
          "SpO2 below 80% indicates severe hypoxemia requiring supplemental oxygen immediately.",
      };
    }
  };

  const generateSummary = (
    heartRateResult: { status: string; message: string },
    spo2Result: { status: string; message: string }
  ) => {
    let urgencyLevel = "Normal";
    let recommendations: string[] = [];

    if (heartRateResult.status !== "Normal" || spo2Result.status !== "Normal") {
      urgencyLevel = "Caution";
    }

    if (
      spo2Result.status === "Severe Hypoxemia" ||
      spo2Result.status === "Critical Hypoxemia"
    ) {
      urgencyLevel = "Urgent";
      recommendations.push("Seek immediate medical attention");
    }

    if (heartRateResult.status === "Bradycardia") {
      recommendations.push("Monitor for symptoms such as dizziness or fatigue");
    }

    if (heartRateResult.status === "Tachycardia") {
      recommendations.push(
        "Monitor for symptoms such as shortness of breath or chest pain"
      );
    }

    if (spo2Result.status === "Mild Hypoxemia") {
      recommendations.push("Consider follow-up with healthcare provider");
    }

    if (spo2Result.status === "Moderate Hypoxemia") {
      recommendations.push("Consult with healthcare provider soon");
    }

    if (spo2Result.status === "Severe Hypoxemia") {
      recommendations.push("Medical attention required");
    }

    if (spo2Result.status === "Critical Hypoxemia") {
      recommendations.push("Supplemental oxygen required immediately");
    }

    if (recommendations.length === 0) {
      recommendations.push("Continue routine monitoring");
    }

    return {
      urgencyLevel,
      recommendations,
    };
  };

  const evaluateVitalSigns = () => {
    if (error) return;

    // Check if both inputs have values
    if (heartRate === undefined || spo2 === undefined) {
      setError("Please enter both heart rate and SpO2 values");
      return;
    }

    const heartRateResult = checkHeartRate(heartRate);
    const spo2Result = checkSpO2(spo2);

    setResults({
      heartRate: heartRateResult,
      spo2: spo2Result,
      summary: generateSummary(heartRateResult, spo2Result),
      timestamp: new Date().toLocaleString(),
    });
  };

  const generatePDF = () => {
    if (!results || !jsPdfLoaded || !window.jspdf) {
      alert("PDF generator is not ready yet. Please try again in a moment.");
      return;
    }

    try {
      // Create new jsPDF instance
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Set fonts and colors
      const titleFont = 16;
      const headingFont = 14;
      const normalFont = 12;
      const smallFont = 10;
      const lineHeight = 10;
      const pageWidth = doc.internal.pageSize.getWidth();

      // Add title
      doc.setFontSize(titleFont);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 150);
      doc.text("Vital Signs Diagnostic Report", pageWidth / 2, 20, {
        align: "center",
      });

      // Add timestamp
      doc.setFontSize(smallFont);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${results.timestamp}`, pageWidth / 2, 30, {
        align: "center",
      });

      // Add heart rate assessment
      doc.setFontSize(headingFont);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Heart Rate Assessment", 20, 50);

      // Add heart rate status
      doc.setFontSize(normalFont);
      doc.setFont("helvetica", "bold");
      const heartRateColor = getStatusRGBColor(results.heartRate.status);
      doc.setTextColor(heartRateColor[0], heartRateColor[1], heartRateColor[2]);
      doc.text(`${results.heartRate.status} - ${heartRate} BPM`, 20, 60);

      // Add heart rate message
      doc.setFontSize(normalFont);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(results.heartRate.message, 20, 70);

      // Add SpO2 assessment
      doc.setFontSize(headingFont);
      doc.setFont("helvetica", "bold");
      doc.text("SpO2 Assessment", 20, 90);

      // Add SpO2 status
      doc.setFontSize(normalFont);
      doc.setFont("helvetica", "bold");
      const spo2Color = getStatusRGBColor(results.spo2.status);
      doc.setTextColor(spo2Color[0], spo2Color[1], spo2Color[2]);
      doc.text(`${results.spo2.status} - ${spo2}%`, 20, 100);

      // Add SpO2 message
      doc.setFontSize(normalFont);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(results.spo2.message, 20, 110);

      // Add summary
      doc.setFontSize(headingFont);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 50, 150);
      doc.text("Summary Assessment", 20, 130);

      // Add urgency level
      doc.setFontSize(normalFont);
      doc.setFont("helvetica", "bold");
      const urgencyColor = getUrgencyRGBColor(results.summary.urgencyLevel);
      doc.setTextColor(urgencyColor[0], urgencyColor[1], urgencyColor[2]);
      doc.text(
        `${results.summary.urgencyLevel.toUpperCase()} SITUATION`,
        20,
        140
      );

      // Add recommendations
      doc.setFontSize(normalFont);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);

      let yPos = 150;
      results.summary.recommendations.forEach((rec, index) => {
        doc.text(`• ${rec}`, 20, yPos);
        yPos += lineHeight;
      });

      // Add footer
      doc.setFontSize(smallFont);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 100, 100);
      yPos = doc.internal.pageSize.getHeight() - 30;
      doc.text(
        "This report is generated by Vital Signs Diagnostic System.",
        pageWidth / 2,
        yPos,
        { align: "center" }
      );
      doc.text(
        "For medical emergencies, call 911 or your local emergency services immediately.",
        pageWidth / 2,
        yPos + 5,
        { align: "center" }
      );
      doc.text(
        "This report is not a substitute for professional medical advice, diagnosis, or treatment.",
        pageWidth / 2,
        yPos + 10,
        { align: "center" }
      );

      // Save the PDF
      doc.save(
        `vital-signs-report-${new Date().toISOString().slice(0, 10)}.pdf`
      );
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      alert("Failed to generate PDF. Please try again later.");
    }
  };

  // Helper function to get RGB color based on status
  const getStatusRGBColor = (status: string): [number, number, number] => {
    switch (status) {
      case "Normal":
        return [22, 163, 74]; // green
      case "Bradycardia":
      case "Tachycardia":
      case "Mild Hypoxemia":
        return [202, 138, 4]; // yellow
      case "Moderate Hypoxemia":
        return [234, 88, 12]; // orange
      case "Severe Hypoxemia":
      case "Critical Hypoxemia":
        return [220, 38, 38]; // red
      default:
        return [75, 85, 99]; // gray
    }
  };

  // Helper function to get RGB color based on urgency level
  const getUrgencyRGBColor = (
    urgencyLevel: string
  ): [number, number, number] => {
    switch (urgencyLevel) {
      case "Normal":
        return [22, 163, 74]; // green
      case "Caution":
        return [202, 138, 4]; // yellow
      case "Urgent":
        return [220, 38, 38]; // red
      default:
        return [75, 85, 99]; // gray
    }
  };

  // Helper function to get CSS class based on status
  const getStatusClass = (status: string): string => {
    if (status === "Normal") return "normal";
    if (
      status === "Bradycardia" ||
      status === "Tachycardia" ||
      status === "Mild Hypoxemia"
    )
      return "caution";
    if (status === "Moderate Hypoxemia") return "warning";
    return "danger";
  };

  const getUrgencyColor = (urgencyLevel: string): string => {
    switch (urgencyLevel) {
      case "Normal":
        return "text-green-600";
      case "Caution":
        return "text-yellow-500";
      case "Urgent":
        return "text-red-600";
      default:
        return "text-gray-800";
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Normal":
        return "bg-green-100 text-green-800 border-green-300";
      case "Bradycardia":
      case "Tachycardia":
      case "Mild Hypoxemia":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Moderate Hypoxemia":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "Severe Hypoxemia":
      case "Critical Hypoxemia":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getHeartRateIcon = (status: string) => {
    if (status === "Normal") {
      return (
        <svg
          className="w-6 h-6 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          ></path>
        </svg>
      );
    } else if (status === "Bradycardia") {
      return (
        <svg
          className="w-6 h-6 text-yellow-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
          ></path>
        </svg>
      );
    } else {
      return (
        <svg
          className="w-6 h-6 text-yellow-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          ></path>
        </svg>
      );
    }
  };

  const getOxygenIcon = (status: string) => {
    if (status === "Normal") {
      return (
        <svg
          className="w-6 h-6 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      );
    } else if (status === "Mild Hypoxemia" || status === "Moderate Hypoxemia") {
      return (
        <svg
          className="w-6 h-6 text-yellow-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          ></path>
        </svg>
      );
    } else {
      return (
        <svg
          className="w-6 h-6 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      );
    }
  };

  // Check if input fields are empty
  const isHeartRateEmpty = heartRate === undefined;
  const isSpo2Empty = spo2 === undefined;

  return (
    <MainLayout>
      <div className="max-w-[34rem] mx-auto mt-7 p-6 bg-gradient-to-b from-blue-50 to-white rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">
            Vital Signs Monitor
          </h1>
          <p className="text-blue-600 mt-1">Medical Diagnostic System</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-800 rounded-lg text-sm">
            <p className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              {error}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md border border-blue-100">
            <label className="block text-sm font-medium text-blue-800 mb-2">
              Heart Rate (BPM)
            </label>
            <div className="relative">
              <input
                type="number"
                value={heartRate ?? ""}
                onChange={(e) => validateAndSetHeartRate(e.target.value)}
                className="text-[0.6rem] sm:text-base w-full px-3 py-2 border border-blue-200 text-black rounded-md shadow-sm appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-none focus:ring-0 focus:ring-blue-500 bg-blue-50"
                min="0"
                placeholder="Enter heart rate"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-5 w-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
            </div>
            {isHeartRateEmpty && (
              <p className="mt-1 text-sm text-gray-500">No value entered</p>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border border-blue-100">
            <label className="block text-sm font-medium text-blue-800 mb-2">
              SpO2 (%)
            </label>
            <div className="relative">
              <input
                type="number"
                value={spo2 ?? ""}
                onChange={(e) => validateAndSetSpo2(e.target.value)}
                className="text-[0.6rem] sm:text-base w-full px-3 py-2 border border-blue-200 text-black rounded-md shadow-sm appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-none focus:ring-0 focus:ring-blue-500 bg-blue-50"
                min="0"
                max="100"
                placeholder="Enter SpO2"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-5 w-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  ></path>
                </svg>
              </div>
            </div>
            {isSpo2Empty && (
              <p className="mt-1 text-sm text-gray-500">No value entered</p>
            )}
          </div>
        </div>

        <button
          onClick={evaluateVitalSigns}
          disabled={!!error}
          className={`w-full py-3 px-4 text-white font-semibold rounded-lg shadow-md transition duration-300 flex items-center justify-center
          ${
            error
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          }`}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          Evaluate Vital Signs
        </button>

        {results && (
          <div className="mt-8 bg-white p-5 rounded-lg shadow-lg border border-blue-100">
            <div className="flex justify-between items-center border-b border-blue-100 pb-3 mb-4">
              <h2 className="text-xl font-bold text-blue-800">
                Diagnostic Results
              </h2>
              <button
                onClick={generatePDF}
                className=" text-[7px] sm:text-[15px] flex flex-col sm:flex-row items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition duration-300"
                disabled={!jsPdfLoaded}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  ></path>
                </svg>
                Download PDF Report
              </button>
            </div>

            <div className="text-sm text-gray-500 mb-4">
              Generated on: {results.timestamp}
            </div>

            <div className="mb-5 flex items-start">
              <div className="mr-3 mt-1">
                {getHeartRateIcon(results.heartRate.status)}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-blue-800">
                  Heart Rate Assessment:
                </h3>
                <div
                  className={`inline-block px-3 py-1 text-sm rounded-full mt-1 border ${getStatusColor(
                    results.heartRate.status
                  )}`}
                >
                  {results.heartRate.status} - {heartRate} BPM
                </div>
                <p className="text-sm mt-2 text-gray-700">
                  {results.heartRate.message}
                </p>
              </div>
            </div>

            <div className="mb-5 flex items-start">
              <div className="mr-3 mt-1">
                {getOxygenIcon(results.spo2.status)}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-blue-800">SpO2 Assessment:</h3>
                <div
                  className={`inline-block px-3 py-1 text-sm rounded-full mt-1 border ${getStatusColor(
                    results.spo2.status
                  )}`}
                >
                  {results.spo2.status} - {spo2}%
                </div>
                <p className="text-sm mt-2 text-gray-700">
                  {results.spo2.message}
                </p>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-800 mb-2">
                Summary Assessment:
              </h3>
              <div
                className={`text-lg font-bold mb-2 ${getUrgencyColor(
                  results.summary.urgencyLevel
                )}`}
              >
                {results.summary.urgencyLevel.toUpperCase()} SITUATION
              </div>
              <ul className="space-y-2">
                {results.summary.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <svg
                      className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 text-xs text-gray-600">
          <p className="font-medium text-blue-800 mb-2">Disclaimer:</p>
          <p className="text-justify">
            This tool is for informational purposes only and is not a substitute
            for professional medical advice or diagnosis. Always consult a
            healthcare provider for medical concerns. Do not use in emergencies.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
