import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Weather from "./pages/Weather";
import MarketPrices from "./pages/MarketPrices";
import CropCalendar from "./pages/CropCalendar";
import PestControl from "./pages/PestControl";
import Equipment from "./pages/Equipment";
import ExpertConsultation from "./pages/ExpertConsultation";
import FarmPlanning from "./pages/FarmPlanning";
import GovernmentSchemes from "./pages/GovernmentSchemes";
import KnowledgeBase from "./pages/KnowledgeBase";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/market-prices" element={<MarketPrices />} />
          <Route path="/crop-calendar" element={<CropCalendar />} />
          <Route path="/pest-control" element={<PestControl />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/expert-consultation" element={<ExpertConsultation />} />
          <Route path="/farm-planning" element={<FarmPlanning />} />
          <Route path="/government-schemes" element={<GovernmentSchemes />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;