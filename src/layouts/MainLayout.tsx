
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
    <div className="min-h-screen flex flex-col bg-[#282829]">
      <Navbar />
      <main className="flex-1 container py-6 px-4 md:px-6 animate-fade-in">
        {children}
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <div className="container">
          © {new Date().getFullYear()} HeartWise. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
