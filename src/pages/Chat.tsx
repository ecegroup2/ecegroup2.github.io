
import MainLayout from "@/layouts/MainLayout";
import ChatInterface from "@/components/ChatInterface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulse, Activity, Info, Stethoscope } from "lucide-react";

const Chat = () => {
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white">AI Consultation</h1>
        <p className="text-muted-foreground mt-1 text-[#FF69B4]">
          Discuss your health concerns with our AI health assistant
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 h-[600px]">
          <ChatInterface />
        </div>
        <div className="space-y-6 -translate-y-20">
          <Card className="animate-float-up">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info size={18} className="text-primary" />
                About Health AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our AI assistant provides general health information based on your vitals. It can suggest when to consult a doctor but does not replace professional medical advice.
              </p>
            </CardContent>
          </Card>

          <Card className="animate-float-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your Latest Vitals</CardTitle>
              <CardDescription>Reference for discussion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HeartPulse size={16} className="text-health-heart" />
                  <span className="text-sm font-medium">Heart Rate</span>
                </div>
                <span className="text-sm">76 bpm</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Stethoscope size={16} className="text-health-oxygen" />
                  <span className="text-sm font-medium">SpO2</span>
                </div>
                <span className="text-sm">97.6%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-health-ecg" />
                  <span className="text-sm font-medium">ECG Status</span>
                </div>
                <span className="text-sm">Normal</span>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-float-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Common Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="p-2 bg-primary/5 rounded-md hover:bg-primary/10 cursor-pointer transition-colors">
                  What does my heart rate indicate?
                </li>
                <li className="p-2 bg-primary/5 rounded-md hover:bg-primary/10 cursor-pointer transition-colors">
                  Is my blood oxygen level normal?
                </li>
                <li className="p-2 bg-primary/5 rounded-md hover:bg-primary/10 cursor-pointer transition-colors">
                  What can cause ECG irregularities?
                </li>
                <li className="p-2 bg-primary/5 rounded-md hover:bg-primary/10 cursor-pointer transition-colors">
                  When should I see a doctor?
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Chat;
