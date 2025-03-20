
import { HeartPulse, Stethoscope, Activity, Download } from "lucide-react";
import HealthMetricCard from "@/components/HealthMetricCard";
import VitalChart from "@/components/VitalChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "@/components/ui/use-toast";

// Mock data for health metrics
const generateMockData = (baseline: number, variance: number, count: number) => {
  const times = Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - (count - i) * 15);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  return times.map(time => ({
    time,
    value: baseline + (Math.random() * variance * 2) - variance
  }));
};

// More realistic ECG simulation
const generateEcgData = (count: number) => {
  // Base ECG pattern (simplified PQRST wave simulation)
  const basePattern = [0, 0.1, 0.2, 0, -0.1, 1.5, -0.5, 0.2, 0.3, 0.2, 0.1, 0];
  const patternLength = basePattern.length;
  
  const times = Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setSeconds(date.getSeconds() - (count - i) * 2);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });

  return times.map((time, index) => {
    // Add some random variation to the base pattern
    const patternIndex = index % patternLength;
    const baseValue = basePattern[patternIndex];
    const randomVariation = (Math.random() * 0.3) - 0.15; // Small random variation
    
    return {
      time,
      value: baseValue + randomVariation + 85 // Offset to keep it in display range
    };
  });
};

const Index = () => {
  const [heartRateData, setHeartRateData] = useState<any[]>([]);
  const [spo2Data, setSpo2Data] = useState<any[]>([]);
  const [ecgData, setEcgData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("today");
  const [isDownloading, setIsDownloading] = useState(false);

  // Simulate data loading
  useEffect(() => {
    setHeartRateData(generateMockData(75, 8, 24));
    setSpo2Data(generateMockData(97, 2, 24));
    setEcgData(generateEcgData(50)); // More data points for ECG
  }, [activeTab]);

  const refreshData = () => {
    setHeartRateData(generateMockData(75, 8, 24));
    setSpo2Data(generateMockData(97, 2, 24));
    setEcgData(generateEcgData(50));
  };

  const downloadData = async () => {
    try {
      setIsDownloading(true);
      const zip = new JSZip();
      
      // Convert data to CSV format
      const heartRateCSV = convertToCSV(heartRateData, "time,heart_rate");
      const spo2CSV = convertToCSV(spo2Data, "time,spo2");
      const ecgCSV = convertToCSV(ecgData, "time,ecg");
      
      // Add files to the zip
      zip.file("heart_rate_data.csv", heartRateCSV);
      zip.file("spo2_data.csv", spo2CSV);
      zip.file("ecg_data.csv", ecgCSV);
      
      // Add JSON format too
      zip.file("heart_rate_data.json", JSON.stringify(heartRateData, null, 2));
      zip.file("spo2_data.json", JSON.stringify(spo2Data, null, 2));
      zip.file("ecg_data.json", JSON.stringify(ecgData, null, 2));
      
      // Generate the zip file
      const content = await zip.generateAsync({ type: "blob" });
      
      // Save the file using FileSaver
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      saveAs(content, `health_data_${timestamp}.zip`);
      
      toast({
        title: "Download Successful",
        description: "Your health data has been downloaded successfully.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error downloading data:", error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading your health data.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper function to convert data to CSV format
  const convertToCSV = (data: any[], header: string) => {
    const rows = data.map(item => `${item.time},${item.value}`);
    return [header, ...rows].join('\n');
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Health Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Track and monitor your vital health metrics
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <HealthMetricCard
          title="Heart Rate"
          value={heartRateData.length > 0 ? heartRateData[heartRateData.length - 1].value.toFixed(0) : "0"}
          unit="BPM"
          icon={<HeartPulse className="h-5 w-5 text-white" />}
          color="text-health-heart"
          trend={{ value: 3.2, isUp: true }}
          status="normal"
        />
        <HealthMetricCard
          title="Blood Oxygen (SpO2)"
          value={spo2Data.length > 0 ? spo2Data[spo2Data.length - 1].value.toFixed(1) : "0"}
          unit="%"
          icon={<Stethoscope className="h-5 w-5 text-white" />}
          color="text-health-oxygen"
          trend={{ value: 0.5, isUp: false }}
          status="normal"
        />
        <HealthMetricCard
          title="ECG Status"
          value="Normal"
          icon={<Activity className="h-5 w-5 text-white" />}
          color="text-health-ecg"
          status="normal"
        />
      </div>

      <div className="mt-6">
        <Card className="animate-float-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Vitals Monitoring</CardTitle>
              <CardDescription>Track your health metrics over time</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Tabs defaultValue="today" value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="sm" onClick={refreshData}>
                Refresh
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadData} 
                disabled={isDownloading}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                {isDownloading ? "Downloading..." : "Download"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Heart Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <VitalChart
                    data={heartRateData}
                    color="#f43f5e"
                    gradientFrom="#f43f5e"
                    gradientTo="#fda4af"
                    yAxisLabel="BPM"
                    unit=" bpm"
                    name="Heart Rate"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Blood Oxygen (SpO2)</CardTitle>
                </CardHeader>
                <CardContent>
                  <VitalChart
                    data={spo2Data}
                    color="#0ea5e9"
                    gradientFrom="#0ea5e9"
                    gradientTo="#7dd3fc"
                    yAxisLabel="%"
                    unit="%"
                    name="SpO2"
                  />
                </CardContent>
              </Card>
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">ECG Readings</CardTitle>
                </CardHeader>
                <CardContent>
                  <VitalChart
                    data={ecgData}
                    color="#16a34a"
                    gradientFrom="#16a34a"
                    gradientTo="#86efac"
                    name="ECG"
                  />
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Index;
