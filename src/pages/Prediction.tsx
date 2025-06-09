import MainLayout from "@/layouts/MainLayout";
import { useState, useEffect } from "react";
import { FaCheckCircle as CheckCircleIcon, FaExclamationTriangle as AlertTriangleIcon, FaHeart as HeartIcon, FaRunning as ActivityIcon, FaDownload as DownloadIcon, FaInfoCircle as InfoIcon, FaExclamationCircle as AlertCircleIcon } from "react-icons/fa";
import { FiClipboard as ClipboardIcon } from "react-icons/fi";
import { useLocation } from "react-router-dom";

interface HealthData {
  myHeartRate: number;
  mySpo2: number;
}

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

export default function Prediction() {
  const [heartRate, setHeartRate] = useState<number | undefined>(undefined);
  const [spo2, setSpo2] = useState<number | undefined>(undefined);
  const [results, setResults] = useState<VitalSignsResult | null>(null);
  const [error, setError] = useState("");
  const [jsPdfLoaded, setJsPdfLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    // First try to get data from router state (if coming from button click)
    if (
      location.state &&
      "myHeartRate" in location.state &&
      "mySpo2" in location.state
    ) {
      setHeartRate(location.state.myHeartRate);
      setSpo2(location.state.mySpo2);
      setIsLoading(false);
    }
    // Otherwise, try to get data from localStorage (if coming from navbar)
    else {
      const savedData = localStorage.getItem("healthData");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setHeartRate(parsedData);
        } catch (error) {
          console.error("Error parsing health data from localStorage", error);
        }
      }
      setIsLoading(false);
    }
  }, [location]);

  // Load jsPDF library on component mount
  useEffect(() => {
    const loadJsPdf = async () => {
      if (!window.jspdf) {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        script.async = true;
        script.onload = () => setJsPdfLoaded(true);
        script.onerror = () => {
          setError("PDF library failed to load. PDF export may not work.");
        };
        document.body.appendChild(script);
      } else {
        setJsPdfLoaded(true);
      }
    };
    loadJsPdf();
    return () => {
      const scriptElement = document.querySelector(
        'script[src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"]'
      );
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
    };
  }, []);

  // Input validation
  const validateAndSetHeartRate = (value: string) => {
    if (value === "") {
      setHeartRate(undefined);
      setError("");
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
    setResults(null);
  };

  const validateAndSetSpo2 = (value: string) => {
    if (value === "") {
      setSpo2(undefined);
      setError("");
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
    setResults(null);
  };

  // Status logic
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

  // Main evaluation
  const evaluateVitalSigns = () => {
    if (error) return;
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

  // PDF Export
  // Enhanced PDF Export Function with Healthcare Professional Design
  // Enhanced PDF Export Function with Improved Padding
  const generatePDF = () => {
    if (!results || !jsPdfLoaded || !window.jspdf) {
      alert("PDF generator is not ready yet. Please try again in a moment.");
      return;
    }

    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Page configuration
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;

      // Colors - using medical/healthcare color scheme
      const primaryColor = [41, 128, 185]; // Blue
      const secondaryColor = [52, 152, 219]; // Lighter blue
      const accentColor = [22, 160, 133]; // Teal
      const criticalColor = [192, 57, 43]; // Red
      const cautionColor = [230, 126, 34]; // Orange
      const normalColor = [39, 174, 96]; // Green
      const textColor = [44, 62, 80]; // Dark blue/gray
      const lightTextColor = [127, 140, 141]; // Gray

      // Add Page Border
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(1);
      doc.rect(10, 10, pageWidth - 15, pageHeight - 15);

      // Add Header with Logo-like design
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, pageWidth, 35, "F");

      // Add a stylized medical cross to mimic a logo
      // Set fill color for icon background
      // doc.setFillColor(255, 255, 255);
      // doc.circle(28, 12, 6, 'F'); // Draw a circle as the icon background
      // Draw circle

      // Draw the plus symbol using rectangles
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(23, 13, 4, 10, "F"); // Vertical bar of "+"
      doc.rect(20, 16, 10, 4, "F"); // Horizontal bar of "+"

      // Title text in header
      // doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(15);
      doc.text("VITAL SIGNS DIAGNOSTIC REPORT", 20, 16, { align: "left" });

      let yPos = 30;
      doc.setFontSize(7);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(0, 0, 0);
      doc.text(
        "Disclaimer: This report is generated by Smart & Early Abnormality Diagnosis System. For medical emergencies, call 911 or your local emergency services immediately.",
        18,
        27,
        { maxWidth: pageWidth - 40, align: "left" }
      );
      // doc.text(
      //   "For medical emergencies, call 911 or your local emergency services immediately.",
      //   pageWidth / 2,
      //   yPos + 10,
      //   { align: "center" }
      // );
      // doc.text(
      //   "This report is not a substitute for professional medical advice, diagnosis, or treatment.",
      //   pageWidth / 2,
      //   yPos + 11,
      //   { align: "center" }
      // );

      // Timestamp and Report ID
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(230, 230, 230);
      doc.text(
        `Report Generated: ${results.timestamp}`,
        pageWidth - margin,
        15,
        { align: "right" }
      );
      doc.text(
        `Report ID: VSR-${Date.now().toString().slice(-8)}`,
        pageWidth - margin,
        20,
        { align: "right" }
      );

      // Increased initial Y position for better spacing from header
      yPos = 36;

      // Vital Signs Section - Header
      doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.rect(margin, yPos, pageWidth - 2 * margin, 10, "F");
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("VITAL SIGNS MEASUREMENTS", margin + 5, yPos + 7);

      // Heart Rate Result - Increased spacing
      yPos += 25; // Increased from 20
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("Heart Rate Assessment", margin, yPos);

      // Draw a value box for heart rate - Increased box height
      yPos += 10;
      const heartRateColor = getStatusRGBColor(results.heartRate.status);
      doc.setFillColor(
        heartRateColor[0],
        heartRateColor[1],
        heartRateColor[2],
        0.1
      );
      doc.setDrawColor(heartRateColor[0], heartRateColor[1], heartRateColor[2]);
      doc.roundedRect(margin, yPos, 70, 30, 3, 3, "FD"); // Increased height from 25 to 30

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(heartRateColor[0], heartRateColor[1], heartRateColor[2]);
      doc.text(`${heartRate} BPM`, margin + 35, yPos + 17, { align: "center" }); // Adjusted vertical position

      // Heart Rate Status - Improved spacing for text
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(heartRateColor[0], heartRateColor[1], heartRateColor[2]);
      doc.text(`Status: ${results.heartRate.status}`, margin + 85, yPos + 10); // Adjusted position

      // Heart Rate Message - Wrap text if needed for longer messages
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);

      // Split long message into multiple lines if needed
      const heartRateLines = doc.splitTextToSize(
        results.heartRate.message,
        pageWidth - margin * 2 - 85
      );
      doc.text(heartRateLines, margin + 85, yPos + 20); // Adjusted position

      // Reference Range for Heart Rate - Increased spacing
      yPos += 40;
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
      doc.text(
        "Reference Range: Normal adult heart rate is typically 60-95 BPM at rest.",
        margin,
        yPos
      );

      // SpO2 Result - Increased spacing
      yPos += 20;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("Oxygen Saturation (SpO2) Assessment", margin, yPos);

      // Draw a value box for SpO2 - Increased box height
      yPos += 10;
      const spo2Color = getStatusRGBColor(results.spo2.status);
      doc.setFillColor(spo2Color[0], spo2Color[1], spo2Color[2], 0.1);
      doc.setDrawColor(spo2Color[0], spo2Color[1], spo2Color[2]);
      doc.roundedRect(margin, yPos, 70, 30, 3, 3, "FD");

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(spo2Color[0], spo2Color[1], spo2Color[2]);
      doc.text(`${spo2}%`, margin + 35, yPos + 17, { align: "center" });

      // SpO2 Status - Improved spacing for text
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(spo2Color[0], spo2Color[1], spo2Color[2]);
      doc.text(`Status: ${results.spo2.status}`, margin + 85, yPos + 10);

      // SpO2 Message - Wrap text if needed for longer messages
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);

      // Split long message into multiple lines if needed
      const spo2Lines = doc.splitTextToSize(
        results.spo2.message,
        pageWidth - margin * 2 - 85
      );
      doc.text(spo2Lines, margin + 85, yPos + 20);

      // Reference Range for SpO2 - Increased spacing
      yPos += 40;
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
      doc.text(
        "Reference Range: Normal SpO2 is typically ≥ 95% in healthy adults.",
        margin,
        yPos
      );

      // Clinical Assessment Section - Increased spacing
      yPos += 20;
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(margin, yPos, pageWidth - 2 * margin, 10, "F");
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("CLINICAL ASSESSMENT", margin + 5, yPos + 7);

      // Summary Block - Increased height for more content
      yPos += 20;
      const urgencyColor = getUrgencyRGBColor(results.summary.urgencyLevel);
      doc.setFillColor(urgencyColor[0], urgencyColor[1], urgencyColor[2], 0.1);
      doc.setDrawColor(urgencyColor[0], urgencyColor[1], urgencyColor[2]);

      // Calculate needed height based on number of recommendations
      const recommendationsCount = results.summary.recommendations.length;
      const summaryBlockHeight = Math.max(40, 25 + recommendationsCount * 10); // Dynamic height based on content

      doc.roundedRect(
        margin,
        yPos,
        pageWidth - 2 * margin,
        summaryBlockHeight,
        3,
        3,
        "FD"
      );

      // Urgency Level
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(urgencyColor[0], urgencyColor[1], urgencyColor[2]);
      doc.text(
        `Assessment: ${results.summary.urgencyLevel.toUpperCase()} SITUATION`,
        margin + 5,
        yPos + 12
      );

      // Recommendations - Improved spacing between items
      yPos += 20;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      // doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setTextColor(0, 255, 0);
      doc.text("Clinical Recommendations:", margin + 5, yPos);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(255, 255, 255);
      results.summary.recommendations.forEach((rec, index) => {
        yPos += 10;
        // Wrap recommendation text if needed
        const recLines = doc.splitTextToSize(rec, pageWidth - 2 * margin - 20);
        doc.text(`• ${recLines[0]}`, margin + 8, yPos);

        // If there are multiple lines in the recommendation
        if (recLines.length > 1) {
          for (let i = 1; i < recLines.length; i++) {
            yPos += 5;
            doc.text(`  ${recLines[i]}`, margin + 8, yPos);
          }
        }
      });

      // Add page number
      yPos += 5;
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.text(`Page 1 of 1`, pageWidth - margin, pageHeight - 10, {
        align: "right",
      });

      // Save the PDF
      doc.save(
        `vital-signs-report-${new Date().toISOString().slice(0, 10)}.pdf`
      );
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Failed to generate PDF. Please try again later.");
    }
  };

  // Helper functions for colors/icons
  const getStatusRGBColor = (status: string): [number, number, number] => {
    switch (status) {
      case "Normal":
        return [22, 163, 74];
      case "Bradycardia":
      case "Tachycardia":
      case "Mild Hypoxemia":
        return [202, 138, 4];
      case "Moderate Hypoxemia":
        return [234, 88, 12];
      case "Severe Hypoxemia":
      case "Critical Hypoxemia":
        return [220, 38, 38];
      default:
        return [75, 85, 99];
    }
  };

  const getUrgencyRGBColor = (
    urgencyLevel: string
  ): [number, number, number] => {
    switch (urgencyLevel) {
      case "Normal":
        return [22, 163, 74];
      case "Caution":
        return [202, 138, 4];
      case "Urgent":
        return [220, 38, 38];
      default:
        return [75, 85, 99];
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Normal":
        return "bg-green-50 border-l-8 border-green-400";
      case "Bradycardia":
      case "Tachycardia":
      case "Mild Hypoxemia":
        return "bg-yellow-50 border-l-8 border-yellow-400";
      case "Moderate Hypoxemia":
        return "bg-orange-50 border-l-8 border-orange-400";
      case "Severe Hypoxemia":
      case "Critical Hypoxemia":
        return "bg-red-50 border-l-8 border-red-400";
      default:
        return "bg-gray-50 border-l-8 border-gray-400";
    }
  };

  const getUrgencyColor = (urgencyLevel: string): string => {
    switch (urgencyLevel) {
      case "Normal":
        return "text-green-700";
      case "Caution":
        return "text-yellow-600";
      case "Urgent":
        return "text-red-700";
      default:
        return "text-gray-700";
    }
  };

  // Icons
  const getHeartRateIcon = (status: string) => {
    if (status === "Normal") {
      return (
        <svg
          className="w-7 h-7 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      );
    } else if (status === "Bradycardia") {
      return (
        <svg
          className="w-7 h-7 text-yellow-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
          />
        </svg>
      );
    } else {
      return (
        <svg
          className="w-7 h-7 text-yellow-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      );
    }
  };

  const getOxygenIcon = (status: string) => {
    if (status === "Normal") {
      return (
        <svg
          className="w-7 h-7 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    } else if (status === "Mild Hypoxemia" || status === "Moderate Hypoxemia") {
      return (
        <svg
          className="w-7 h-7 text-yellow-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      );
    } else {
      return (
        <svg
          className="w-7 h-7 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M18.364 5.636A9 9 0 105.636 18.364 9 9 0 0018.364 5.636zM9 12h6"
          />
        </svg>
      );
    }
  };

  // Main Render
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 mt-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-teal-500 mb-2 tracking-tight">
            Vital Signs Prediction
          </h1>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-teal-400 to-blue-500 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="group">
            <label
              htmlFor="heartRate"
              className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-200"
            >
              Heart Rate (BPM)
            </label>
            <div className="relative">
              <input
                id="heartRate"
                type="number"
                min="0"
                max="240"
                value={heartRate ?? ""}
                onChange={(e) => validateAndSetHeartRate(e.target.value)}
                placeholder="e.g., 72"
                className="text-black w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none transition-all duration-200 shadow-sm"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <HeartIcon className="h-5 w-5 text-red-500" />
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500 italic">
              Normal range: 60 - 95 BPM
            </p>
          </div>
          
          <div className="group">
            <label
              htmlFor="spo2"
              className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-200"
            >
              SpO₂ (%)
            </label>
            <div className="relative">
              <input
                id="spo2"
                type="number"
                min="0"
                max="100"
                value={spo2 ?? ""}
                onChange={(e) => validateAndSetSpo2(e.target.value)}
                placeholder="e.g., 98"
                className="text-black w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none transition-all duration-200 shadow-sm"
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
                    d="M12 22c4.418 0 8-3.582 8-8V8a4 4 0 00-8-8 4 4 0 00-8 8v6c0 4.418 3.582 8 8 8z"
                  />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500 italic">
              Normal range: ≥ 95%
            </p>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm animate-pulse">
            <div className="flex items-center">
              <AlertTriangleIcon className="h-5 w-5 mr-2" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}
        
        <div className="my-10 flex justify-center items-center">
          <button
            onClick={evaluateVitalSigns}
            className="h-14 w-64 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 
            text-white font-medium tracking-wide text-lg shadow-lg hover:shadow-xl 
            hover:scale-105 transform transition-all duration-300 
            flex items-center justify-center gap-2 relative overflow-hidden group"
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
            <ActivityIcon className="h-5 w-5" />
            <span>Evaluate</span>
          </button>
        </div>
        
        <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded-lg shadow-sm">
          <div className="flex">
            <InfoIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm italic">
              <span className="font-semibold">Disclaimer:</span> This report is generated by Smart & Early Abnormality Diagnosis System. For medical emergencies, call 102 or your local emergency services immediately.
            </p>
          </div>
        </div>
        
        {results && (
          <div className="space-y-8 animate-fadeIn">
            {/* Heart Rate Result */}
            <div
              className={`${getStatusColor(
                results.heartRate.status
              )} p-6 rounded-xl shadow-md transition-all duration-300 transform hover:scale-[1.01] flex items-start`}
            >
              <div className="mr-5 bg-white p-3 rounded-full shadow-md">
                {getHeartRateIcon(results.heartRate.status)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  Heart Rate: {heartRate} BPM
                  <span className="text-sm px-3 py-1 rounded-full capitalize bg-opacity-20 bg-gray-800 text-gray-800">
                    {results.heartRate.status}
                  </span>
                </h2>
                <p className="mt-2 text-gray-700 leading-relaxed">
                  {results.heartRate.message}
                </p>
              </div>
            </div>
            
            {/* SpO2 Result */}
            <div
              className={`${getStatusColor(
                results.spo2.status
              )} p-6 rounded-xl shadow-md transition-all duration-300 transform hover:scale-[1.01] flex items-start`}
            >
              <div className="mr-5 bg-white p-3 rounded-full shadow-md">
                {getOxygenIcon(results.spo2.status)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  SpO₂: {spo2}%
                  <span className="text-sm px-3 py-1 rounded-full capitalize bg-opacity-20 bg-gray-800 text-gray-800">
                    {results.spo2.status}
                  </span>
                </h2>
                <p className="mt-2 text-gray-700 leading-relaxed">
                  {results.spo2.message}
                </p>
              </div>
            </div>
            
            {/* Summary */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-md">
              <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                <ClipboardIcon className="h-5 w-5 mr-2" />
                Summary Assessment
              </h3>
              <div className="mb-4 p-3 rounded-lg bg-white bg-opacity-70 shadow-sm">
                <p
                  className={`font-bold text-lg flex items-center ${getUrgencyColor(
                    results.summary.urgencyLevel
                  )}`}
                >
                  <AlertCircleIcon className="h-5 w-5 mr-2" />
                  Urgency Level: {results.summary.urgencyLevel.toUpperCase()}
                </p>
              </div>
              <ul className="space-y-2 text-gray-700">
                {results.summary.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* PDF Export */}
            <div className="text-center mt-10">
              <button
                onClick={generatePDF}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center mx-auto"
              >
                <DownloadIcon className="h-5 w-5 mr-2" />
                Export Report as PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
