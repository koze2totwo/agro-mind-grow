import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Cloud, 
  TrendingUp, 
  Calendar, 
  Bug, 
  Wrench, 
  Users, 
  Map, 
  FileText, 
  BookOpen,
  Leaf
} from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { to: "/", icon: Leaf, label: "Dashboard" },
    { to: "/weather", icon: Cloud, label: "Weather" },
    { to: "/market-prices", icon: TrendingUp, label: "Market Prices" },
    { to: "/crop-calendar", icon: Calendar, label: "Crop Calendar" },
    { to: "/pest-control", icon: Bug, label: "Pest Control" },
    { to: "/equipment", icon: Wrench, label: "Equipment" },
    { to: "/expert-consultation", icon: Users, label: "Expert Consultation" },
    { to: "/farm-planning", icon: Map, label: "Farm Planning" },
    { to: "/government-schemes", icon: FileText, label: "Gov Schemes" },
    { to: "/knowledge-base", icon: BookOpen, label: "Knowledge Base" },
  ];

  return (
    <nav className="bg-card border-b shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
              AgroMind
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              
              return (
                <Link key={item.to} to={item.to}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <span className="sr-only">Open menu</span>
              ☰
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;