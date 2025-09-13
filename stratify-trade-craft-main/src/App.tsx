import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/layout/AppSidebar";
import Header from "./components/layout/Header";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import StrategyBuilder from "./pages/StrategyBuilder";
import Backtesting from "./pages/Backtesting";
import SocialTrading from "./pages/SocialTrading";
import Reports from "./pages/Reports";
import Portfolio from "./pages/Portfolio";
import Copilot from "./pages/Copilot";
import FundManagement from "./pages/FundManagement";
import Wishlist from "./pages/Wishlist";
import Assistance from "./pages/Assistance"; // ✅ NEW
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isLandingPage = location.pathname === "/" && !isAuthenticated;
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  if (isLandingPage || isAuthPage) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="h-12 flex items-center border-b bg-background/95 backdrop-blur">
            <SidebarTrigger className="ml-4" />
          </header>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/strategy-builder" element={<StrategyBuilder />} />
            <Route path="/backtesting" element={<Backtesting />} />
            <Route path="/social-trading" element={<SocialTrading />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/copilot" element={<Copilot />} />
            <Route path="/fund-management" element={<FundManagement />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/assistance" element={<Assistance />} /> {/* ✅ NEW */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
