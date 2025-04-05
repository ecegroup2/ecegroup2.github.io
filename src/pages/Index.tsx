
import { HeartPulse, Stethoscope, Activity, Download } from "lucide-react";
import HealthMetricCard from "@/components/HealthMetricCard";
import VitalChart from "@/components/VitalChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChangeEvent, useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "@/components/ui/use-toast";
import { set } from "date-fns";
import { title } from "process";

// // Mock data for health metrics
// const generateMockData = (baseline: number, variance: number, count: number) => {
//   const times = Array.from({ length: count }, (_, i) => {
//     const date = new Date();
//     date.setMinutes(date.getMinutes() - (count - i) * 15);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   });
// 
//   return times.map(time => ({
//     time,
//     value: baseline + (Math.random() * variance * 2) - variance
//   }));
// };

// // More realistic ECG simulation
// const generateEcgData = (count: number) => {
//   // Base ECG pattern (simplified PQRST wave simulation)
//   const basePattern = [0, 0.1, 0.2, 0, -0.1, 1.5, -0.5, 0.2, 0.3, 0.2, 0.1, 0];
//   const patternLength = basePattern.length;
  
//   const times = Array.from({ length: count }, (_, i) => {
//     const date = new Date();
//     date.setSeconds(date.getSeconds() - (count - i) * 2);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
//   });

//   return times.map((time, index) => {
//     // Add some random variation to the base pattern
//     const patternIndex = index % patternLength;
//     const baseValue = basePattern[patternIndex];
//     const randomVariation = (Math.random() * 0.3) - 0.15; // Small random variation
    
//     return {
//       time,
//       value: baseValue + randomVariation + 85 // Offset to keep it in display range
//     };
//   });
// };

const Index = () => {
  const [heartRateData, setHeartRateData] = useState<any[]>([]);
  const [spo2Data, setSpo2Data] = useState<any[]>([]);
  const [ecgData, setEcgData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("today");
  const [isDownloading, setIsDownloading] = useState(false);

  // // Simulate data loading
  // useEffect(() => {
  //   setHeartRateData(generateMockData(75, 8, 24));
  //   setSpo2Data(generateMockData(97, 2, 24));
  //   setEcgData(generateEcgData(50)); // More data points for ECG
  // }, [activeTab]);

  // const refreshData = () => {
  //   setHeartRateData(generateMockData(75, 8, 24));
  //   setSpo2Data(generateMockData(97, 2, 24));
  //   setEcgData(generateEcgData(50));
  // };

  // const downloadData = async () => {
  //   try {
  //     setIsDownloading(true);
  //     const zip = new JSZip();
  
  //     // Convert data to CSV format
  //     const convertToCSV = (data: any[], headers: string) => {
  //       const rows = data.map((item: { [s: string]: unknown; } | ArrayLike<unknown>) => Object.values(item).join(","));
  //       return `${headers}\n${rows.join("\n")}`;
  //     };
  
  //     const heartRateCSV = convertToCSV(heartRateData, "time,heart_rate");
  //     const spo2CSV = convertToCSV(spo2Data, "time,spo2");
  //     const ecgCSV = convertToCSV(ecgData, "time,ecg");
  
  //     // Add files to the ZIP
  //     zip.file("heart_rate_data.csv", heartRateCSV);
  //     zip.file("spo2_data.csv", spo2CSV);
  //     zip.file("ecg_data.csv", ecgCSV);
  
  //     // Add JSON format too
  //     zip.file("heart_rate_data.json", JSON.stringify(heartRateData, null, 2));
  //     zip.file("spo2_data.json", JSON.stringify(spo2Data, null, 2));
  //     zip.file("ecg_data.json", JSON.stringify(ecgData, null, 2));
  
  //     // Generate the ZIP file
  //     const content = await zip.generateAsync({ type: "blob" });
  
  //     // Save the file using FileSaver
  //     const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  //     saveAs(content, `health_data_${timestamp}.zip`);
  
  //     // Success toast
  //     toast({
  //       title: "Download Successful",
  //       description: "Your health data has been downloaded successfully.",
  //       duration: 3000,
  //     });
  //   } catch (error) {
  //     console.error("Error downloading data:", error);
  
  //     // Error toast
  //     toast({
  //       title: "Download Failed",
  //       description: "There was an error downloading your health data.",
  //       variant: "destructive",
  //       duration: 3000,
  //     });
  //   } finally {
  //     setIsDownloading(false);
  //   }
  // };



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
  

  
  
  



  //new update

  interface TestData {
    userId: number;
    heartrate: number;
    spo2: number;
    ecg: string | null;
  }
  
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [data, setData] = useState<TestData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [heartRate, setHeartRate] = useState<number>(0);
  const [spo2, setSpo2] = useState<number>(0);
  


  // after selecting the date, it will show the data of that date
  const handleDateChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value;
    setSelectedDate(date);
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://raspi.local:9080/api/data/getByDate?date=${date}`);
      if (!response.ok) {
        toast({
          title: "Fetching Error",
          description: "There was an error fetching the test result.",
          variant: "destructive",
          duration: 3000,
        });
        throw new Error('Failed to fetch data');
      }
      const fetchedData: TestData[] = await response.json();
      setData(fetchedData);
    } catch (err) {
      setError('Error fetching tests for the selected date.');
    } finally {
      setLoading(false);
    }
  };



  // automatically mount the data of current date
  useEffect(()=>{
    const fetchData = async () => {
      setLoading(true);
      setError('');
  
      try {
        const response = await fetch(`http://raspi.local:9080/api/data/getByDate?date=${selectedDate}`);
        if (!response.ok) {
          toast({
            title: "Fetching Error",
            description: "There was an error fetching the test result.",
            variant: "destructive",
            duration: 3000,
          });
          throw new Error('Failed to fetch data');
        }
        const fetchedData: TestData[] = await response.json();
        setData(fetchedData);
      } catch (err) {
        setError('Error fetching tests for the selected date.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [selectedDate]);

// automatically mount the data of last test in the box
const [lasttestdata, setLastTestData] = useState<TestData[]>([]);
  useEffect(() => {
    const lastdata = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`http://raspi.local:9080/api/data/getall`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const lastdata : TestData[] = await response.json();

        setLastTestData(lastdata);

        // Set initial heart rate and SpO2 to the last test result
        if (lastdata.length > 0) {
          const lastTest = lastdata[lastdata.length - 1];
          setHeartRate(lastTest.heartrate);
          setSpo2(lastTest.spo2);
        }
      } catch (err) {
        setError('Error fetching data for the selected date.');
      } finally {
        setLoading(false);
      }
    };

    lastdata();
  }, []);

 
  // after clicking on details button, it will show the heart rate and spo2 value
  const handleDetailsClick = (heartrate: number, spo2: number) => {
    setHeartRate(heartrate);
    console.log('Your heartrate data',heartRate) ;
    setSpo2(spo2);
    console.log('Your spo2 data',spo2) ;
  };
  





  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight"> <span className=" text-green-500 cursor-pointer hover:text-green-300">Health</span> <span className="text-orange-600 cursor-pointer hover:text-orange-300">Dashboard</span></h1>
        <p className="mt-1 text-[#df348a7c] hover:text-muted-foreground">
          Track and monitor your vital health metrics
        </p>
      </div>

      {/* for ecg diagram part */}
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

                  <input
                      type="date"
                      id="dateSelector"
                      value={selectedDate}
                      onChange={handleDateChange}
                    />
                  
                  {/* <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger> */}
                </TabsList>
              </Tabs>
             
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadData .bind(null,heartRate, spo2, ecgData, setIsDownloading, toast)} 
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

      {/* for spo2 hear rate checking part */}
      <div className="mt-[3rem] grid gap-6 grid-cols-1 md:grid-cols-3">
        <HealthMetricCard
          title="Heart Rate"
          value={heartRate}
          // value={heartRateData.length > 0 ? heartRateData[heartRateData.length - 1].value.toFixed(0) : "0"}
          unit="BPM"
          icon={<HeartPulse className="h-5 w-5 text-white" />}
          color="text-health-heart"
          trend={{ value: 3.2, isUp: true }}
          status="normal"
        />
        <HealthMetricCard
          title="Blood Oxygen (SpO2)"
          value={spo2}
          // value={spo2Data.length > 0 ? spo2Data[spo2Data.length - 1].value.toFixed(1) : "0"}
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
    <section className="py-6">
    

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : data.length > 0 ? (
        <table className="text-white w-full bg-[#0f172a] rounded-lg shadow-md">
  <thead>
    <tr className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-6 py-4 bg-[#1e293b]">
      <th className="text-center text-xs sm:text-sm md:text-base">User ID</th>
      <th className="text-center text-xs sm:text-sm md:text-base">Time</th>
      <th className="text-center text-xs sm:text-sm md:text-base">Heart Rate</th>
      <th className="text-center text-xs sm:text-sm md:text-base">SpO2</th>
      <th className="text-center text-xs sm:text-sm md:text-base">More</th>
    </tr>
  </thead>
  <tbody>
    {data
      .slice()
      .sort((a, b) => b.userId - a.userId) // Sort latest results first
      .map((item) => (
        <tr
          key={item.userId}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-6 py-4 hover:bg-[#1e293b] hover:shadow-lg transition duration-300"
        >
          <td className="text-center text-xs sm:text-sm md:text-base">
            {`${item.userId.toString().slice(0, 4)}/${item.userId
              .toString()
              .slice(4, 6)}/${item.userId.toString().slice(6, 8)}`}
          </td>
          <td className="text-center text-xs sm:text-sm md:text-base">
            {`${item.userId.toString().slice(8, 10)}:${item.userId
              .toString()
              .slice(10, 12)}:${item.userId.toString().slice(12, 14)}`}
          </td>
          <td className="text-center text-xs sm:text-sm md:text-base">{item.heartrate}</td>
          <td className="text-center text-xs sm:text-sm md:text-base">{item.spo2}</td>
          <td
            className="text-center text-xs sm:text-sm md:text-base hover:text-green-500 cursor-pointer"
            onClick={() => handleDetailsClick(item.heartrate, item.spo2)}
          >
            Details
          </td>
        </tr>
      ))}
  </tbody>
</table>
      ) : (
        // Trigger toast outside the JSX return statement
        (() => {
          toast({
            title: "No Data",
            description: "No test data available for the selected date.",
            variant: "destructive",
            duration: 3000,
          });
          return <p>No data available for the selected date.</p>;
        })()
      )}
    
      

    </section>
      

      
    </MainLayout>
  );  
};

export default Index;

function convertToCSV(heartRateData: any[], arg1: string) {
  throw new Error("Function not implemented.");
}
function fetchData() {
  throw new Error("Function not implemented.");
}

