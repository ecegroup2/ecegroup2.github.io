import MainLayout from "@/layouts/MainLayout";
import ChatInterface from "@/components/ChatInterface";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HeartPulse, Activity, Info, Stethoscope } from "lucide-react";
import { useState } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUploader from "@/components/ImageUploader";
import EcgAnalysis from "@/components/EcgAnalysis";
import ResultsPanel from "@/components/ResultsPanel";
import { AnalysisResult } from "@/types/ecg";
import { analyzeEcgImage } from "@/services/ecgAnalysisService";
import { toast } from "@/hooks/use-toast";
import { AlertCircle, Heart } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Chat = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleImageUpload = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setResults(null);
    setAnalysisError(null);

    if (imageUrl) {
      setActiveTab("analyze");
      toast({
        title: "Image uploaded successfully",
        description: "You can now analyze the ECG image.",
      });
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const result = await analyzeEcgImage(selectedImage);
      setResults(result);
      setActiveTab("results");

      toast({
        title: result.abnormal
          ? "Analysis Complete - Abnormalities Detected"
          : "Analysis Complete - Normal Results",
        description: result.abnormal
          ? "Potential heart conditions were identified. Check the results."
          : "Your ECG appears to be within normal parameters.",
        variant: result.abnormal ? "destructive" : "default",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "There was an error analyzing your ECG. Please try again.";

      setAnalysisError(errorMessage);

      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-rose-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 relative">
        <div className="absolute inset-0 opacity-5 bg-heart-pattern pointer-events-none"></div>
        <div className="container mx-auto px-4 py-8 relative z-10">
          <header className="text-center mb-12">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-4 text-center px-4 sm:px-6">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-rose-500 animate-pulse" />
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-shadow bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
                Check Your Heart Health with AI
              </h1>
            </div>

            <p className="text-md sm:text-lg text-justify text-slate-600 dark:text-slate-300 mt-2 max-w-2xl mx-auto">
              Advanced ECG Analysis using AI to help identify potential heart
              conditions from standard ECG images
            </p>
          </header>

          <Card className="w-full max-w-4xl mx-auto shadow-xl border-0 overflow-hidden">
            <CardHeader className="header-gradient text-white relative overflow-hidden p-8">
              <div className="absolute inset-0 bg-heart-pattern opacity-10"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-bold">
                    ECG Image Analyzer
                  </CardTitle>
                </div>
                <CardDescription className="text-blue-50 mt-2 text-base">
                  Upload an ECG image to analyze heart health indicators with
                  our advanced AI
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 mb-8 p-1 bg-slate-100 dark:bg-slate-800/50">
                  <TabsTrigger
                    value="upload"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                  >
                    Upload
                  </TabsTrigger>
                  <TabsTrigger
                    value="analyze"
                    disabled={!selectedImage}
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                  >
                    Analyze
                  </TabsTrigger>
                  <TabsTrigger
                    value="results"
                    disabled={!results}
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                  >
                    Results
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload">
                  <ImageUploader
                    onImageUpload={handleImageUpload}
                    selectedImage={selectedImage}
                  />
                </TabsContent>

                <TabsContent value="analyze">
                  {analysisError ? (
                    <Alert
                      variant="destructive"
                      className="mb-6 border-rose-300 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-800"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{analysisError}</AlertDescription>
                    </Alert>
                  ) : null}

                  <EcgAnalysis
                    imageUrl={selectedImage!}
                    onAnalyze={handleAnalyze}
                    isAnalyzing={isAnalyzing}
                  />
                </TabsContent>

                <TabsContent value="results">
                  {results && (
                    <ResultsPanel results={results} imageUrl={selectedImage!} />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* <footer className="text-center mt-12 text-sm text-slate-500 dark:text-slate-400">
          <p>© 2023 HeartGraphia - For educational purposes only</p>
          <p className="mt-1">This tool does not provide medical advice. Consult healthcare professionals for diagnosis.</p>
        </footer> */}
        </div>
      </div>
    </MainLayout>
  );
};

export default Chat;