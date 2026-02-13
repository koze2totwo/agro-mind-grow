import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navigation from "@/components/Navigation";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Weather from "./pages/Weather";
import MarketPrices from "./pages/MarketPrices";
import CropCalendar from "./pages/CropCalendar";
import PestControl from "./pages/PestControl";
import CropRecommendation from "./pages/CropRecommendation";
import Equipment from "./pages/Equipment";
import PlanningConsultation from "./pages/PlanningConsultation";
import KnowledgeBase from "./pages/KnowledgeBase";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Layout component to wrap protected pages
const ProtectedLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    {/* Top Navigation */}
    <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-green-100 dark:border-green-900 shadow-sm">
      <div className="w-full px-4">
        <Navigation />
      </div>
    </div>

    {/* Main Content */}
    <main className="flex-1 w-full">
      {children}
    </main>

    {/* Footer */}
    <footer className="bg-white dark:bg-gray-900 border-t border-green-100 dark:border-green-900 p-4">
      <div className="w-full px-4 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} AgroMind Grow. All rights reserved.
      </div>
    </footer>
  </div>
);

// Routes component to handle conditional layout
const AppRoutes = () => {
  const location = useLocation();
  const isPublicRoute = location.pathname === "/" || location.pathname === "/login";

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Index />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/weather"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Weather />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/market-prices"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <MarketPrices />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/crop-calendar"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <CropCalendar />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pest-control"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <PestControl />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/equipment"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Equipment />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/crop-recommendation"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <CropRecommendation />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/planning"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <PlanningConsultation />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/knowledge-base"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <KnowledgeBase />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;