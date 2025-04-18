import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="overflow-x-hidden min-h-screen flex flex-col bg-[#282829] text-white">
      <Navbar />
      <main className="flex-1 w-full px-4 py-6 md:px-6">
        <div className="max-w-screen-xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
      <footer className="w-full py-4 text-center text-sm text-muted-foreground px-4 space-y-2">
        <div className="max-w-screen-xl mx-auto"><span className="font-bold">Contact:</span> <span className="font-semibold cursor-pointer text-slate-300" onClick={function sendMail() {
            window.location.href = "mailto:office@example.com";
        }
}>projectimposs@gmail.com</span></div>
        <div className="max-w-screen-xl mx-auto">
          © {new Date().getFullYear()} HeartWise. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
