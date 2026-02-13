import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Cloud,
  TrendingUp,
  Calendar,
  Bug,
  Wrench,
  Users,
  BookOpen,
  Leaf,
  Sprout,
  LogOut,
  Menu,
  X,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Feature pages organized in dropdown
  const featureItems = [
    { to: "/pest-control", icon: Bug, label: "Disease Prediction" },
    { to: "/crop-recommendation", icon: Sprout, label: "Crop Recommendation" },
    { to: "/weather", icon: Cloud, label: "Weather Forecast" },
    { to: "/market-prices", icon: TrendingUp, label: "Market Prices" },
    { to: "/crop-calendar", icon: Calendar, label: "Crop Calendar" },
    { to: "/equipment", icon: Wrench, label: "Equipment" },
    { to: "/planning", icon: Users, label: "Planning & Consultation" },
    { to: "/knowledge-base", icon: BookOpen, label: "Knowledge Base" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isFeatureActive = featureItems.some(item => location.pathname === item.to);

  return (
    <nav className="w-full">
      <div className="h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 text-foreground group">
          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            AgroMind Grow
          </span>
        </Link>

        {/* Right Side - Navigation & User Profile */}
        <div className="flex items-center gap-3">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Dashboard Link */}
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === "/dashboard"
                  ? "bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 shadow-sm"
                  : "text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30"
                }`}
            >
              <Leaf className="w-4 h-4" />
              Dashboard
            </Link>

            {/* Features Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`flex items-center gap-1 px-4 py-2 h-auto text-sm font-medium transition-all ${isFeatureActive
                      ? "bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400"
                      : "text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30"
                    }`}
                >
                  <Sprout className="w-4 h-4" />
                  Features
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  AI-Powered Tools
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {featureItems.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.to;
                  return (
                    <DropdownMenuItem key={item.to} asChild>
                      <Link
                        to={item.to}
                        className={`flex items-center gap-3 px-2 py-2 cursor-pointer ${active ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400" : ""
                          }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* User Profile Dropdown */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-3 py-2 h-auto hover:bg-green-50 dark:hover:bg-green-950/30"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline font-medium text-sm">{user.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.username}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-green-100 dark:border-green-900 shadow-lg z-50 animate-in slide-in-from-top">
          <div className="px-4 py-4 space-y-1">
            {/* Dashboard */}
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${location.pathname === "/dashboard"
                ? "bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 font-medium"
                : "text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30"
                }`}
            >
              <Leaf className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>

            {/* Features Section Header */}
            <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Features
            </div>

            {/* Feature Items */}
            {featureItems.map((item) => {
              const active = location.pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${active
                    ? "bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 font-medium"
                    : "text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;