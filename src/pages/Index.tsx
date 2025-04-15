
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
import ECGDiagram from "@/components/ui/ECGDiagram";



const Index = () => {
  const [heartRateData, setHeartRateData] = useState<any[]>([]);
  const [spo2Data, setSpo2Data] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("today");
  const [isDownloading, setIsDownloading] = useState(false);

  

  const downloadData = async () => {
    try {
      setIsDownloading(true);
      const zip = new JSZip();
      
      // Convert data to CSV format
      const heartRateCSV = convertToCSV(heartRateData, "time,heart_rate");
      const spo2CSV = convertToCSV(spo2Data, "time,spo2");
      // const ecgCSV = convertToCSV(ecgData, "time,ecg");
      
      // Add files to the zip
      zip.file("heart_rate_data.csv", heartRateCSV);
      zip.file("spo2_data.csv", spo2CSV);
      // zip.file("ecg_data.csv", ecgCSV);
      
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
  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD in local time
  };
  
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());
  // const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [data, setData] = useState<TestData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [heartRate, setHeartRate] = useState<number>(0);
  const [spo2, setSpo2] = useState<number>(0);
  const [ecgData, setEcgData] = useState<string[] | null>(null);


  
  
  
 // Handle date change and fetch data for the selected date
const handleDateChange = async (event: ChangeEvent<HTMLInputElement>) => {
  const date = event.target.value;
  setSelectedDate(date);
  setLoading(true);
  setError('');

  try {
    const response = await fetch(`http://${window.location.hostname}:9080/api/data/getByDate?date=${date}`);
    // const response = await fetch(`http://raspi.local:9080/api/data/getByDate?date=${date}`);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    
    const fetchedData: TestData[] = await response.json();
    setData(fetchedData);
    console.log('fetch Data',fetchedData);
    
    if(fetchedData.length>0){
      const latest = fetchedData[fetchedData.length - 1];
      setHeartRate(latest.heartrate);
      setSpo2(latest.spo2);
      setEcgData(latest.ecg ? [latest.ecg] : null);
      // setEcgData(latest.ecg.split(','));

      toast({
      title: "Data Fetched",
      description: "Data fetched successfully.",
      variant: "success",
      duration: 3000,
    })}else {
      setHeartRate(0);
      setSpo2(0);
      setEcgData(null);
      toast({
      title: "No Data",
      description: "No data available for the selected date.",
      variant: "destructive",
      duration: 3000,
    });
 }} catch (err) {
    setError('Error fetching data for the selected date.');
    toast({
      title: "Fetching Error",
      description: "There was an error fetching the test result.",
      variant: "destructive",
      duration: 3000,
    });
  } finally {
    setLoading(false);
  }
};

// Automatically mount the data of last test in the box
const [lasttestdata, setLastTestData] = useState<TestData[]>([]);

// useEffect(() => {
//   const lastdata = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await fetch(`http://${window.location.hostname}:9080/api/data/getall`);
//       // const response = await fetch(`http://raspi.local:9080/api/data/getall`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch data');
//       }

//       const lastdata: TestData[] = await response.json();
//       setLastTestData(lastdata);
//       console.log('lastData',lastdata) ;

//       if (lastdata.length > 0) {
//         const lastTest = lastdata[lastdata.length - 1];
//         console.log('lastTest',lastTest)
//         setHeartRate(lastTest.heartrate);
//         setSpo2(lastTest.spo2);
//         // console.log('typo',typeof lastTest.ecg)
//         // setEcgData(lastTest.ecg ? JSON.parse(lastTest.ecg).map(Number) : null);
//         setEcgData(lastTest.ecg ? [lastTest.ecg] : null);
//         console.log('lasttestecg....',lastTest.ecg)
//         // console.log('this is my last test ecgdata', lastTest.ecg ? JSON.parse(lastTest.ecg).map(Number) : null);
//       }
//     } catch (err) {
//       // setError('Server Error');
//       setError('Error fetching data for the selected date.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   lastdata();
// }, []);

console.log('ecgData',ecgData)
// Automatically mount the data of current date
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://${window.location.hostname}:9080/api/data/getByDate?date=${selectedDate}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const fetchedData: TestData[] = await response.json();
      console.log('fetchData',fetchedData) ;
      setData(fetchedData);
      console.log(fetchedData.length)
      if (fetchedData.length > 0) {
        const latest = fetchedData[fetchedData.length - 1];
        setHeartRate(latest.heartrate);
        setSpo2(latest.spo2);
        setEcgData(latest.ecg ? [latest.ecg] : null);
        // console.log('eluuuuluuu',ecgData)
        toast({
              title: "Data Fetched",
              description: "Data fetched successfully.",
              variant: "success",
              duration: 3000,
            });
      } else {
        setHeartRate(0);
        setSpo2(0);
        setEcgData(null);
      }
      // if(fetchedData.length>0){
      //   const latest = fetchedData[fetchedData.length - 1];
      //   setHeartRate(latest.heartrate);
      //   setSpo2(latest.spo2);
      //   setEcgData(latest.ecg ? [latest.ecg] : null);
      //   toast({
      //     title: "Data Fetched",
      //     description: "Data fetched successfully.",
      //     variant: "success",
      //     duration: 3000,
      //   });
      // } else {
      //   setHeartRate(0);
      //   setSpo2(0);
      //   setEcgData(null);
      // }
    } catch (err) {
      setError('Error fetching data for the selected date.');
      toast({
        title: "Fetching Error",
        description: "There was an error fetching the test result.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [selectedDate]);



// Show data on clicking "Details" button
const handleDetailsClick = (heartrate: number, spo2: number,ecg:string) => {
  setHeartRate(heartrate);
  setSpo2(spo2);
  setEcgData(ecg ? [ecg] : null);
};



console.log('mydata',data) ;
  





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
                  <ECGDiagram ecgData={ecgData ? [ecgData.toString()] : []} />
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
          unit="BPM"
          icon={<HeartPulse className="h-5 w-5 text-white" />}
          color="text-health-heart"
          trend={{ value: 3.2, isUp: true }}
          status="normal"
        />
        <HealthMetricCard
          title="Blood Oxygen (SpO2)"
          value={spo2}
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
        <div className="text-white mt-4 flex justify-center items-center mx-auto fond-bold italic">Loading...</div>
      ) : error ? (
        <p className="text-white mx-auto flex justify-center items-center border-white rounded-md bg-red-800 w-[20rem] h-10">{error}</p>
      ) : data.length > 0 ? (
        <table className="text-white w-full bg-[#0f172a] rounded-lg shadow-md">
            <thead>
              <tr className="flex justify-between items-center md:flex md:justify-between md:items-center lg:grid lg:grid-cols-5 gap-6 px-6 py-4 bg-[#1e293b]">
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
              .sort((a, b) => b.userId - a.userId) 
              .map((item) => (
                <tr
                  key={item.userId}
                  className="flex justify-between items-center md:flex md:justify-between md:items-center lg:grid lg:grid-cols-5 gap-6 px-6 py-4 hover:bg-[#1e293b] hover:shadow-lg transition duration-300"
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
                    onClick={() => handleDetailsClick(item.heartrate, item.spo2,item.ecg)}
                  >
                    Details
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : <div className="text-white mx-auto flex justify-center items-center border-white rounded-md bg-red-800 w-[20rem] h-10">No data available for the selected date.</div>  
      }
    
      

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