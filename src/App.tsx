
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Prediction from "./pages/Prediction";
import Doctors from "./pages/Doctors";
import Testimonial from "./pages/Testimonial.tsx"; // Ensure the file './pages/Testimonial.tsx' exists or update the path to the correct file.
import NotFound from "./pages/NotFound";
import IntroductionPage from "./pages/IntroductionPage"; // Ensure the file './pages/IntroductionPage.tsx' exists or update the path to the correct file.



const App = () => (
   <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/we" element={<IntroductionPage />} />
          <Route path="/intro" element={<IntroductionPage />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/Testimonial" element={<Testimonial />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
);



export default App;