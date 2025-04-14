
import MainLayout from "@/layouts/MainLayout";
import ChatInterface from "@/components/ChatInterface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
        title: result.abnormal ? "Analysis Complete - Abnormalities Detected" : "Analysis Complete - Normal Results",
        description: result.abnormal 
          ? "Potential heart conditions were identified. Check the results." 
          : "Your ECG appears to be within normal parameters.",
        variant: result.abnormal ? "destructive" : "default",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      const errorMessage = error instanceof Error ? error.message : "There was an error analyzing your ECG. Please try again.";
      
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
          <div className="inline-flex items-center justify-center gap-3 mb-3">
            <Heart className="h-8 w-8 text-rose-500 animate-pulse" />
            <h1 className="text-5xl font-bold text-shadow bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">HeartGraphia</h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-300 mt-2 max-w-2xl mx-auto">
            Advanced ECG Analysis using AI to help identify potential heart conditions from standard ECG images
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
                <CardTitle className="text-2xl font-bold">ECG Image Analyzer</CardTitle>
              </div>
              <CardDescription className="text-blue-50 mt-2 text-base">
                Upload an ECG image to analyze heart health indicators with our advanced AI
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 p-1 bg-slate-100 dark:bg-slate-800/50">
                <TabsTrigger value="upload" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">Upload</TabsTrigger>
                <TabsTrigger value="analyze" disabled={!selectedImage} className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                  Analyze
                </TabsTrigger>
                <TabsTrigger value="results" disabled={!results} className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                  Results
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload">
                <ImageUploader onImageUpload={handleImageUpload} selectedImage={selectedImage} />
              </TabsContent>
              
              <TabsContent value="analyze">
                {analysisError ? (
                  <Alert variant="destructive" className="mb-6 border-rose-300 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-800">
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
                {results && <ResultsPanel results={results} imageUrl={selectedImage!} />}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <footer className="text-center mt-12 text-sm text-slate-500 dark:text-slate-400">
          <p>© 2023 HeartGraphia - For educational purposes only</p>
          <p className="mt-1">This tool does not provide medical advice. Consult healthcare professionals for diagnosis.</p>
        </footer>
      </div>
    </div>
    </MainLayout>
    // <MainLayout>
    //   <div className="mb-6">
    //     <h1 className="text-3xl font-bold tracking-tight text-white">AI Consultation</h1>
    //     <p className="text-muted-foreground mt-1 text-[#FF69B4]">
    //       Discuss your health concerns with our AI health assistant
    //     </p>
    //   </div>

    //   <div className="grid gap-6 md:grid-cols-3">
    //     <div className="md:col-span-2 h-[600px]">
    //       <ChatInterface />
    //     </div>
    //     <div className="space-y-6 -translate-y-20">
    //       <Card className="animate-float-up">
    //         <CardHeader className="pb-2">
    //           <CardTitle className="text-lg flex items-center gap-2">
    //             <Info size={18} className="text-primary" />
    //             About Health AI
    //           </CardTitle>
    //         </CardHeader>
    //         <CardContent>
    //           <p className="text-sm text-muted-foreground">
    //             Our AI assistant provides general health information based on your vitals. It can suggest when to consult a doctor but does not replace professional medical advice.
    //           </p>
    //         </CardContent>
    //       </Card>

    //       <Card className="animate-float-up" style={{ animationDelay: "0.1s" }}>
    //         <CardHeader className="pb-2">
    //           <CardTitle className="text-lg">Your Latest Vitals</CardTitle>
    //           <CardDescription>Reference for discussion</CardDescription>
    //         </CardHeader>
    //         <CardContent className="space-y-4">
    //           <div className="flex items-center justify-between">
    //             <div className="flex items-center gap-2">
    //               <HeartPulse size={16} className="text-health-heart" />
    //               <span className="text-sm font-medium">Heart Rate</span>
    //             </div>
    //             <span className="text-sm">76 bpm</span>
    //           </div>
    //           <div className="flex items-center justify-between">
    //             <div className="flex items-center gap-2">
    //               <Stethoscope size={16} className="text-health-oxygen" />
    //               <span className="text-sm font-medium">SpO2</span>
    //             </div>
    //             <span className="text-sm">97.6%</span>
    //           </div>
    //           <div className="flex items-center justify-between">
    //             <div className="flex items-center gap-2">
    //               <Activity size={16} className="text-health-ecg" />
    //               <span className="text-sm font-medium">ECG Status</span>
    //             </div>
    //             <span className="text-sm">Normal</span>
    //           </div>
    //         </CardContent>
    //       </Card>

    //       <Card className="animate-float-up" style={{ animationDelay: "0.2s" }}>
    //         <CardHeader className="pb-2">
    //           <CardTitle className="text-lg">Common Topics</CardTitle>
    //         </CardHeader>
    //         <CardContent>
    //           <ul className="space-y-2 text-sm">
    //             <li className="p-2 bg-primary/5 rounded-md hover:bg-primary/10 cursor-pointer transition-colors">
    //               What does my heart rate indicate?
    //             </li>
    //             <li className="p-2 bg-primary/5 rounded-md hover:bg-primary/10 cursor-pointer transition-colors">
    //               Is my blood oxygen level normal?
    //             </li>
    //             <li className="p-2 bg-primary/5 rounded-md hover:bg-primary/10 cursor-pointer transition-colors">
    //               What can cause ECG irregularities?
    //             </li>
    //             <li className="p-2 bg-primary/5 rounded-md hover:bg-primary/10 cursor-pointer transition-colors">
    //               When should I see a doctor?
    //             </li>
    //           </ul>
    //         </CardContent>
    //       </Card>
    //     </div>
    //   </div>
    // </MainLayout>
  );
};

export default Chat;
