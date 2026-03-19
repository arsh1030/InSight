import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import EmployeeMonitor from "@/pages/EmployeeMonitor";
import AlertPanel from "@/pages/AlertPanel";
import EmployeeProfile from "@/pages/EmployeeProfile";
import PeerAnalytics from "@/pages/PeerAnalytics";
import PredictiveForecasting from "@/pages/PredictiveForecasting";
import FederatedLearning from "@/pages/FederatedLearning";
import ComplianceReport from "@/pages/ComplianceReport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AppProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/employees" element={<EmployeeMonitor />} />
                <Route path="/alerts" element={<AlertPanel />} />
                <Route path="/profile" element={<EmployeeProfile />} />
                <Route path="/peer-analytics" element={<PeerAnalytics />} />
                <Route path="/predictions" element={<PredictiveForecasting />} />
                <Route path="/federated" element={<FederatedLearning />} />
                <Route path="/compliance" element={<ComplianceReport />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
