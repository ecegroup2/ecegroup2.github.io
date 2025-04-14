
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Microscope, Heart, BarChart2, Activity, BrainCircuit, Cpu, Scan } from "lucide-react";
import { useState, useEffect } from "react";
import { getEcgModelInfo } from "@/services/ecgAnalysisService";

interface EcgAnalysisProps {
  imageUrl: string;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const EcgAnalysis = ({ imageUrl, onAnalyze, isAnalyzing }: EcgAnalysisProps) => {
  const [progress, setProgress] = useState(0);
  const modelInfo = getEcgModelInfo();
  
  // Simulate progress updates during analysis
  useEffect(() => {
    if (isAnalyzing) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress >= 95 ? 95 : newProgress;
        });
      }, 300);
      
      return () => {
        clearInterval(interval);
        setProgress(0);
      };
    } else if (progress > 0) {
      // Reset progress when analysis is complete
      setProgress(0);
    }
  }, [isAnalyzing]);
  
  return (
    <div className="space-y-8">
      <Card className="p-6 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-slate-900 border border-blue-100 dark:border-blue-900/40 shadow-md overflow-hidden relative">
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-200 dark:bg-blue-900/20 rounded-full -translate-y-1/3 translate-x-1/3 filter blur-3xl opacity-30"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-medium">ECG Image Preview</h3>
              </div>
              <div className="rounded-xl border border-blue-200 dark:border-blue-900/40 overflow-hidden h-48 md:h-64 bg-white dark:bg-slate-800 shadow-inner">
                <img
                  src={imageUrl}
                  alt="ECG Graph"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <BarChart2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-medium">Analysis Parameters</h3>
              </div>
              <div className="space-y-4">
                <div className="p-3 rounded-lg border border-blue-100 dark:border-blue-900/40 bg-white dark:bg-slate-800 shadow-sm flex items-center gap-3 transition-all hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700">
                  <div className="h-9 w-9 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 dark:text-red-400">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Advanced Rhythm Analysis</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Using high-precision waveform detection algorithms</div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg border border-blue-100 dark:border-blue-900/40 bg-white dark:bg-slate-800 shadow-sm flex items-center gap-3 transition-all hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700">
                  <div className="h-9 w-9 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500 dark:text-purple-400">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Hybrid AlexNet-SVM Model</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {modelInfo.name} v{modelInfo.version} ({modelInfo.accuracy}% accuracy)
                    </div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg border border-blue-100 dark:border-blue-900/40 bg-white dark:bg-slate-800 shadow-sm flex items-center gap-3 transition-all hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700">
                  <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 dark:text-blue-400">
                    <BrainCircuit className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">AI-Powered Detection</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Detecting {modelInfo.supportedConditions} heart conditions with clinical precision</div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg border border-blue-100 dark:border-blue-900/40 bg-white dark:bg-slate-800 shadow-sm flex items-center gap-3 transition-all hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700">
                  <div className="h-9 w-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500 dark:text-green-400">
                    <Scan className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Universal ECG Recognition</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Supports all ECG formats, both labeled and non-labeled, from clinical devices to smartphone apps
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="text-center">
        {isAnalyzing ? (
          <div className="space-y-4 max-w-md mx-auto">
            <Progress value={progress} className="w-full h-2 bg-blue-100 dark:bg-blue-900/30" />
            <div className="flex items-center justify-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></div>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Analyzing your ECG with {modelInfo.name}... Please wait.
              </p>
            </div>
          </div>
        ) : (
          <Button 
            onClick={onAnalyze} 
            size="lg" 
            className="px-8 py-2 h-12 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 border-0 text-white font-medium"
          >
            <Activity className="mr-2 h-5 w-5" />
            Run Advanced ECG Analysis
          </Button>
        )}
      </div>
    </div>
  );
};

export default EcgAnalysis;
