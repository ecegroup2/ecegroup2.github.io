
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { AlertCircle, Info, Upload, Heart } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { validateEcgImage } from "@/services/ecgAnalysisService";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  selectedImage: string | null;
}

const ImageUploader = ({ onImageUpload, selectedImage }: ImageUploaderProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const validateAndUpload = async (dataUrl: string) => {
    setIsValidating(true);
    setError(null);
    
    try {
      const validation = await validateEcgImage(dataUrl);
      
      if (!validation.isValid) {
        setError(validation.message || "The uploaded image does not appear to be an ECG graph");
        toast({
          title: "Invalid ECG Image",
          description: validation.message || "Please upload a clear image of an ECG graph",
          variant: "destructive",
        });
        return false;
      }
      
      onImageUpload(dataUrl);
      return true;
    } catch (err) {
      setError("Error validating image");
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);
      const file = acceptedFiles[0];
      
      if (!file) return;
      
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }
      
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          await validateAndUpload(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"]
    },
    maxFiles: 1,
    disabled: isValidating
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-rose-500" />
          <h3 className="text-md font-medium">Upload ECG Image</h3>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full bg-blue-50 dark:bg-blue-900/30">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="sr-only">ECG Type Info</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white dark:bg-gray-800 shadow-lg border border-blue-100 dark:border-blue-900 p-4 rounded-lg">
              <div className="max-w-xs">
                <p className="font-semibold mb-1 text-blue-700 dark:text-blue-300">Supported ECG Types:</p>
                <ul className="list-disc pl-4 text-xs space-y-1">
                  <li>12-lead ECG (standard clinical format)</li>
                  <li>3-lead ECG (from monitors or devices)</li>
                  <li>Single-lead rhythm strips</li>
                  <li>Holter monitor reports</li>
                  <li>Digital ECG exports from various devices</li>
                  <li>Smartphone ECG apps (AliveCor, Kardia, etc.)</li>
                  <li>Printed or scanned ECG reports</li>
                  <li>Wearable device ECG recordings</li>
                  <li>Both labeled and non-labeled ECGs</li>
                </ul>
                <p className="text-xs mt-1 text-gray-500">Our system can detect most ECG formats</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 cursor-pointer text-center transition-colors relative overflow-hidden
          ${isValidating ? "border-blue-400 bg-blue-50/50 dark:bg-blue-900/10" : 
            selectedImage ? "border-green-400 bg-green-50 dark:bg-green-900/20" : 
              isDragActive ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20" : 
                "border-gray-300 hover:border-blue-400 dark:border-gray-600 dark:hover:border-blue-400"}
        `}
      >
        <div className="absolute inset-0 opacity-10 bg-heart-pattern"></div>
        <div className="relative z-10">
          <input {...getInputProps()} />
          
          {isValidating ? (
            <div className="py-8">
              <div className="animate-pulse text-blue-600 dark:text-blue-400 font-medium">
                Validating ECG image...
              </div>
            </div>
          ) : selectedImage ? (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-full">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                ECG image successfully validated!
              </div>
              <div className="max-h-64 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 shadow-md">
                <img 
                  src={selectedImage} 
                  alt="Uploaded ECG" 
                  className="object-contain w-full h-full" 
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Drag and drop a different image to replace
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="h-16 w-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-sm font-medium">
                {isDragActive ? "Drop the ECG image here" : "Drag and drop your ECG image here"}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Or click to select a file
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Supported formats: JPG, PNG, GIF (Max: 5MB)
              </p>
              <div className="mt-3 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 py-1 px-3 rounded-full inline-block">
                Supports both labeled and non-labeled ECG formats
              </div>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="border-rose-300 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {selectedImage && (
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={() => onImageUpload("")}
            className="border-red-200 hover:bg-red-50 text-red-500 hover:text-red-600 dark:border-red-800 dark:hover:bg-red-900/20"
          >
            Remove Image
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
