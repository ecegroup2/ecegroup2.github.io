import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle,
  Heart,
  FileDown,
  ArrowDownToLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalysisResult } from "@/types/ecg";
import { toast } from "@/hooks/use-toast";

interface ResultsPanelProps {
  results: AnalysisResult;
  imageUrl: string;
}

const ResultsPanel = ({ results, imageUrl }: ResultsPanelProps) => {
  const { abnormal, confidenceScore, conditions, recommendations } = results;

  const handleDownloadReport = () => {
    try {
      // Create a simple report in a new window
      const reportWindow = window.open("", "_blank");
      if (!reportWindow) {
        throw new Error("Popup blocked. Please allow popups for this site.");
      }

      // Add CSS
      reportWindow.document.write(`
        <html>
        <head>
          <title>ECG Analysis Report</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
            h1 { color: #3b82f6; }
            .header { display: flex; justify-content: space-between; align-items: center; }
            .status { padding: 8px 16px; border-radius: 4px; display: inline-block; margin-bottom: 20px; }
            .abnormal { background-color: #ffedd5; color: #c2410c; }
            .normal { background-color: #dcfce7; color: #15803d; }
            .section { margin-bottom: 30px; }
            .condition { margin-bottom: 15px; }
            .probability-bar { height: 10px; background-color: #e5e7eb; border-radius: 5px; margin-top: 5px; overflow: hidden; }
            .probability-fill { height: 100%; background-color: #3b82f6; }
            .high { background-color: #ef4444; }
            .medium { background-color: #f59e0b; }
            .recommendation { display: flex; align-items: flex-start; margin-bottom: 10px; }
            .bullet { width: 8px; height: 8px; background-color: #3b82f6; border-radius: 50%; margin-top: 8px; margin-right: 10px; }
            .footer { font-size: 12px; color: #6b7280; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
            img { max-width: 100%; max-height: 300px; object-fit: contain; border: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ECG Analysis Report</h1>
            <div>Date: ${new Date().toLocaleDateString()}</div>
          </div>
          
          <div class="section">
            <h2>ECG Image</h2>
            <img src="${imageUrl}" alt="ECG Graph" />
          </div>
          
          <div class="section">
            <h2>Analysis Result</h2>
            <div class="status ${abnormal ? "abnormal" : "normal"}">
              ${
                abnormal
                  ? "Potential Abnormalities Detected"
                  : "No Significant Abnormalities"
              }
            </div>
            <div>Confidence Score: ${confidenceScore.toFixed(1)}%</div>
            <p>
              ${
                abnormal
                  ? "Our AI analysis detected potential abnormal patterns in your ECG."
                  : "Your ECG appears to be within normal parameters based on our analysis."
              }
            </p>
          </div>
      `);

      // Add conditions if any
      if (conditions.length > 0) {
        reportWindow.document.write(`
          <div class="section">
            <h2>Detected Conditions</h2>
        `);

        conditions.forEach((condition) => {
          const colorClass =
            condition.probability > 70
              ? "high"
              : condition.probability > 50
              ? "medium"
              : "";

          reportWindow.document.write(`
            <div class="condition">
              <div style="display: flex; justify-content: space-between;">
                <strong>${condition.name}</strong>
                <span>${condition.probability}% probability</span>
              </div>
              <div class="probability-bar">
                <div class="probability-fill ${colorClass}" style="width: ${condition.probability}%"></div>
              </div>
            </div>
          `);
        });

        reportWindow.document.write(`</div>`);
      }

      // Add recommendations
      reportWindow.document.write(`
        <div class="section">
          <h2>Recommendations</h2>
      `);

      recommendations.forEach((recommendation) => {
        reportWindow.document.write(`
          <div class="recommendation">
            <div class="bullet"></div>
            <div>${recommendation}</div>
          </div>
        `);
      });

      reportWindow.document.write(`
        </div>
        
        <div class="footer flex justify-center items-center flex-col flex-wrap mt-3">
          <p><strong>Disclaimer:</strong> This analysis is not a substitute for professional medical advice. Always consult a qualified healthcare provider for proper diagnosis and treatment.</p>
          <p>@HealthiFy 2025</p>
        </div>
       
        </body>
        </html>
      `);

      // Print dialog
      setTimeout(() => {
        reportWindow.print();
      }, 500);

      toast({
        title: "Report Generated",
        description: "You can now print or save the report as PDF.",
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Report Generation Failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an error generating the report.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-lg sm:text-xl font-semibold">Analysis Results</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadReport}
          className="w-full sm:w-auto"
        >
          <ArrowDownToLine className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>

      <Card
        className={`border-l-4 ${
          abnormal ? "border-l-amber-500" : "border-l-green-500"
        }`}
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            {abnormal ? (
              <>
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span>Potential Abnormalities Detected</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-[16px] sm:text-lg">
                  No Significant Abnormalities
                </span>
              </>
            )}
          </CardTitle>
          <CardDescription>
            Confidence score: {confidenceScore.toFixed(1)}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {abnormal
              ? "Our AI analysis detected potential abnormal patterns in your ECG."
              : "Your ECG appears to be within normal parameters based on our analysis."}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="text-[16px] sm:text-lg">
                Detected Conditions
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {conditions.length > 0 ? (
              <ul className="space-y-4">
                {conditions.map((condition, index) => (
                  <li key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm sm:text-base">
                        {condition.name}
                      </span>
                      <Badge
                        variant={
                          condition.probability > 70 ? "destructive" : "outline"
                        }
                        className={`text-xs sm:text-sm ${
                          condition.probability > 70
                            ? ""
                            : "text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {condition.probability}% probability
                      </Badge>
                    </div>
                    <Progress
                      value={condition.probability}
                      className={condition.probability > 70 ? "bg-red-100" : ""}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center p-4 text-sm text-gray-500">
                No significant conditions detected
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[16px] sm:text-lg">
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="min-w-[8px] h-[8px] rounded-full bg-blue-500 mt-1"></div>
                  <span className="text-sm sm:text-base">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="text-justify text-xs text-gray-500 mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
        <strong>Disclaimer:</strong> This analysis is not a substitute for professional medical advice. Always consult a qualified healthcare provider for proper diagnosis and treatment.
      </div>
    </div>
  );
};

export default ResultsPanel;
