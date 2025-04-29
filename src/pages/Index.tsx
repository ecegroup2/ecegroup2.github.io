import { HeartPulse, Stethoscope, Activity, Download } from "lucide-react";
import HealthMetricCard from "@/components/HealthMetricCard";
import VitalChart from "@/components/VitalChart";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChangeEvent, useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import JSZip from "jszip";
import { saveAs } from "file-saver";
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
      const heartRateCSV = convertToCSVFormat(heartRateData, "time,heart_rate");
      const spo2CSV = convertToCSVFormat(spo2Data, "time,spo2");

      // Add files to the zip
      zip.file("heart_rate_data.csv", heartRateCSV);
      zip.file("spo2_data.csv", spo2CSV);

      // Add JSON format too
      zip.file("heart_rate_data.json", JSON.stringify(heartRateData, null, 2));
      zip.file("spo2_data.json", JSON.stringify(spo2Data, null, 2));
      zip.file("ecg_data.json", JSON.stringify(ecgData, null, 2));

      // Generate the zip file
      const content = await zip.generateAsync({ type: "blob" });

      // Save the file using FileSaver
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      saveAs(content, `health_data_${timestamp}.zip`);
      toast.success("Download Successful");
    } catch (error) {
      console.error("Error downloading data:", error);
      toast.error("Download Failed");
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper function to convert data to CSV format
  const convertToCSVFormat = (data: any[], header: string) => {
    const rows = data.map((item) => `${item.time},${item.value}`);
    return [header, ...rows].join("\n");
  };

  interface TestData {
    userId: number;
    heartrate: number;
    spo2: number;
    ecg: string | null;
  }

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-CA"); // Format as YYYY-MM-DD in local time
  };

  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());
  const [data, setData] = useState<TestData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [heartRate, setHeartRate] = useState<number>(0);
  const [spo2, setSpo2] = useState<number>(0);
  const [ecgData, setEcgData] = useState<string[] | null>(null);

  // Handle date change and fetch data for the selected date
  const handleDateChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value;
    setSelectedDate(date);
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://${window.location.hostname}:9080/api/data/getByDate?date=${date}`
      );
      if (!response.ok) {
        toast.error("Fetching Error");
        throw new Error("Failed to fetch data");
      }

      const fetchedData: TestData[] = await response.json();
      setData(fetchedData);
      console.log("fetch Data", fetchedData);

      if (fetchedData.length > 0) {
        const latest = fetchedData[fetchedData.length - 1];
        setHeartRate(latest.heartrate);
        setSpo2(latest.spo2);
        setEcgData(latest.ecg ? [latest.ecg] : null);
        toast.success("Data Fetched Successfully");
      } else {
        setHeartRate(0);
        setSpo2(0);
        setEcgData(null);
      }
    } catch (err) {
      setError("Error fetching data for the selected date.");
      toast.error("Fetching Error");
    } finally {
      setLoading(false);
    }
  };

  // Automatically mount the data of current date
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `http://${window.location.hostname}:9080/api/data/getByDate?date=${selectedDate}`
        );
        if (!response.ok) {
          toast.error("Fetching Error");
          throw new Error("Failed to fetch data");
        }
        const fetchedData: TestData[] = await response.json();
        console.log("fetchData", fetchedData);
        setData(fetchedData);

        if (fetchedData.length > 0) {
          const latest = fetchedData[fetchedData.length - 1];
          setHeartRate(latest.heartrate);
          setSpo2(latest.spo2);
          setEcgData(latest.ecg ? [latest.ecg] : null);
          toast.success("Data Fetched Successfully");
        } else {
          toast.error("No data available for the selected date.");
          setHeartRate(0);
          setSpo2(0);
          setEcgData(null);
        }
      } catch (err) {
        setError("Error fetching data for the selected date.");
        toast.error("Fetching Error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  // Show data on clicking "Details" button
  const handleDetailsClick = (heartrate: number, spo2: number, ecg: string) => {
    setHeartRate(heartrate);
    setSpo2(spo2);
    setEcgData(ecg ? [ecg] : null);
  };

  return (
    <MainLayout>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent drop-shadow-md">
          Health Dashboard
        </h1>
        <p className="mt-1 flex flex-row gap-1 text-pink-400 text-sm sm:text-base hover:text-pink-900">
          Track and monitor your vital health metrics
          <Activity className="text-blue-400 mt-[0.3rem] w-5 h-5" />
        </p>
      </div>

      {/* for ecg diagram part */}
      <div className="mt-6">
        <Card className="animate-float-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
              {/* Left: Title & Description */}
              <div className="text-center sm:text-left">
                <CardTitle className="text-xl sm:text-2xl">
                  Vitals Monitoring
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Track your health metrics over time
                </CardDescription>
              </div>

              {/* Right: Date Picker + Download Button */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
                <Tabs
                  defaultValue="today"
                  value={activeTab}
                  onValueChange={setActiveTab}
                >
                  <TabsList className="p-0 bg-black">
                    <input
                      className="w-full sm:w-36 h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  onClick={downloadData}
                  disabled={isDownloading}
                  className="flex items-center justify-center gap-1 w-full sm:w-auto"
                >
                  <Download className="h-4 w-4" />
                  {isDownloading ? "Downloading..." : "Download"}
                </Button>
              </div>
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
          <div className="text-white mt-4 flex justify-center items-center mx-auto fond-bold italic">
            Loading...
          </div>
        ) : error ? (
          <p className="text-white mx-auto flex justify-center items-center text-center border-white rounded-md bg-red-800 max-w-[20rem] max-h-12">
            {error}
          </p>
        ) : data.length > 0 ? (
          <table className="text-white w-full bg-[#0f172a] rounded-lg shadow-md">
            <thead>
              <tr className="flex justify-between items-center md:flex md:justify-between md:items-center lg:grid lg:grid-cols-3 gap-6 px-6 py-4 bg-[#1e293b]">
                <th className="text-center text-xs sm:text-sm md:text-base">
                  User ID
                </th>
                <th className="text-center text-xs sm:text-sm md:text-base">
                  Time
                </th>
                {/* <th className="text-center text-xs sm:text-sm md:text-base">
                  Heart Rate
                </th>
                <th className="text-center text-xs sm:text-sm md:text-base">
                  SpO2
                </th> */}
                <th className="text-center text-xs sm:text-sm md:text-base">
                  More
                </th>
              </tr>
            </thead>
            <tbody>
              {data
                .slice()
                .sort((a, b) => b.userId - a.userId)
                .map((item) => (
                  <tr
                    key={item.userId}
                    className="flex justify-between items-center md:flex md:justify-between md:items-center lg:grid lg:grid-cols-3 gap-6 px-6 py-4 hover:bg-[#1e293b] hover:shadow-lg transition duration-300"
                  >
                    <td className="text-center text-xs sm:text-sm md:text-base">
                      {`${item.userId.toString().slice(0, 4)}/${item.userId
                        .toString()
                        .slice(4, 6)}/${item.userId.toString().slice(6, 8)}`}
                    </td>
                    <td className="text-center text-xs sm:text-sm md:text-base">
                      {`${item.userId.toString().slice(8, 10)}:${item.userId
                        .toString()
                        .slice(10, 12)}:${item.userId
                        .toString()
                        .slice(12, 14)}`}
                    </td>
                    {/* <td className="text-center text-xs sm:text-sm md:text-base">
                      {item.heartrate}
                    </td>
                    <td className="text-center text-xs sm:text-sm md:text-base">
                      {item.spo2}
                    </td> */}
                    <td
                      className="text-center text-xs sm:text-sm md:text-base hover:text-green-500 cursor-pointer"
                      onClick={() =>
                        handleDetailsClick(item.heartrate, item.spo2, item.ecg)
                      }
                    >
                      Details
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <div className="text-white mx-auto flex justify-center items-center rounded-md bg-red-800 text-sm px-4 py-2 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl text-center">
            No data available for the selected date.
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default Index;
