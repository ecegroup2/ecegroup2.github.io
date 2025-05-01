import MainLayout from "@/layouts/MainLayout";
import ChatInterface from "@/components/ChatInterface";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HeartPulse, Activity, Info, Stethoscope, AlertCircle, Heart, ChevronRight, CheckCircle2, BarChart3 } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUploader from "@/components/ImageUploader";
import EcgAnalysis from "@/components/EcgAnalysis";
import ResultsPanel from "@/components/ResultsPanel";
import { AnalysisResult } from "@/types/ecg";
import { analyzeEcgImage } from "@/services/ecgAnalysisService";
import { toast } from "@/hooks/use-toast";
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
      <div className="min-h-screen relative">
        <div className="absolute inset-0 opacity-5 bg-heart-pattern pointer-events-none"></div>
        <div className="container mx-auto px-4 py-8 relative z-10">
          <header className="mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-rose-500 rounded-full opacity-20 animate-ping"></div>
                <Heart className="h-8 w-8 text-rose-500" />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-3">
              HealthiFy AI
            </h1>
            
            <div className="flex justify-center">
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-rose-500 to-transparent mb-6"></div>
            </div>
            
            <p className="text-md text-center text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Advanced ECG analysis using artificial intelligence to help identify potential heart conditions
            </p>
          </header>

          <div className="relative mb-12 max-w-5xl mx-auto">
            <div className="absolute -top-6 -left-6 w-12 h-12 border-t-2 border-l-2 border-rose-300 opacity-60"></div>
            <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-2 border-r-2 border-rose-300 opacity-60"></div>
            
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="pb-0 pt-6 px-6 flex flex-col items-center text-center border-b">
                <div className="flex items-center justify-center w-full">
                  <div className="flex space-x-2 items-center">
                    <HeartPulse className="h-5 w-5 text-rose-500" />
                    <CardTitle className="text-2xl font-light tracking-tight">
                      ECG Analysis
                    </CardTitle>
                  </div>
                </div>
                <CardDescription className="mt-2 mb-6 text-slate-500">
                  Upload an ECG image to analyze heart health indicators
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="pt-0 px-0">
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="w-full flex rounded-none border-b h-14">
                      <TabsTrigger
                        value="upload"
                        className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-rose-500 data-[state=active]:text-rose-500 data-[state=active]:shadow-none"
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-xs uppercase tracking-wide font-medium">Step 1</span>
                          <span className="flex items-center mt-1">
                            <Heart className="h-3.5 w-3.5 mr-1.5" />
                            Upload
                          </span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger
                        value="analyze"
                        disabled={!selectedImage}
                        className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-rose-500 data-[state=active]:text-rose-500 data-[state=active]:shadow-none"
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-xs uppercase tracking-wide font-medium">Step 2</span>
                          <span className="flex items-center mt-1">
                            <Activity className="h-3.5 w-3.5 mr-1.5" />
                            Analyze
                          </span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger
                        value="results"
                        disabled={!results}
                        className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-rose-500 data-[state=active]:text-rose-500 data-[state=active]:shadow-none"
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-xs uppercase tracking-wide font-medium">Step 3</span>
                          <span className="flex items-center mt-1">
                            <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
                            Results
                          </span>
                        </div>
                      </TabsTrigger>
                    </TabsList>

                    <div className="p-6">
                      <TabsContent value="upload" className="mt-0">
                        <div className="mt-2">
                          <ImageUploader
                            onImageUpload={handleImageUpload}
                            selectedImage={selectedImage}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="analyze" className="mt-0">
                        {analysisError ? (
                          <Alert
                            variant="destructive"
                            className="mb-6 border-rose-300"
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

                      <TabsContent value="results" className="mt-0">
                        {results && (
                          <ResultsPanel results={results} imageUrl={selectedImage!} />
                        )}
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>

                <div className="px-6 py-4 border-t flex justify-between items-center text-sm text-slate-500">
                  <div className="flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    <span>For ECG Analysis</span>
                  </div>
                  
                  {activeTab !== "results" && (
                    <button 
                      onClick={() => {
                        if (activeTab === "upload" && selectedImage) {
                          setActiveTab("analyze");
                        } else if (activeTab === "analyze" && !isAnalyzing) {
                          handleAnalyze();
                        }
                      }}
                      disabled={(activeTab === "upload" && !selectedImage) || (activeTab === "analyze" && isAnalyzing)}
                      className="px-4 py-2 border border-rose-500 text-rose-500 hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors duration-200"
                    >
                      {activeTab === "upload" ? "Continue" : "Run Analysis"}
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center mb-2">
                    <HeartPulse className="h-4 w-4 text-rose-500" />
                  </div>
                  <CardTitle className="text-lg">Fast Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500">
                    Get instant results with our AI-powered ECG analysis technology
                  </p>
                </CardContent>
              </Card>
              
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center mb-2">
                    <Stethoscope className="h-4 w-4 text-rose-500" />
                  </div>
                  <CardTitle className="text-lg">Health Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500">
                    Identify potential heart conditions with detailed explanations
                  </p>
                </CardContent>
              </Card>
              
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center mb-2">
                    <CheckCircle2 className="h-4 w-4 text-rose-500" />
                  </div>
                  <CardTitle className="text-lg">Easy to Use</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500">
                    Simple three-step process with intuitive interface design
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default Chat;