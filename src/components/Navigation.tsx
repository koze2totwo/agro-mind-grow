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
import "./side.css"
const showSidebar= () => {
  const sidebar=document.querySelector('#sidebar') as HTMLDivElement;
  sidebar.style.display = 'flex';
 
  
}
const closeSidebar = () => {
  const sidebar=document.querySelector('#sidebar') as HTMLDivElement;
  sidebar.style.display = 'none';
  
}
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
            <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent pr-6">
              AgroMind
            </span>
          </Link>
          
          <div className="flex items-center space-x-1 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none" >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              
              return (
                <Link key={item.to} to={item.to}>
                  <Button id="hideOnMobile"
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center space-x-2 "
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
            <li id="menu" className="md-hidden" onClick={()=>showSidebar()}><a href="#"><svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="#141010ff"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg></a></li>
          </div>

           <div id="sidebar" className="hidden md:flex items-center space-x-1 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none" >
              <li onClick={()=>closeSidebar()}><a href="#"><svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="#080808ff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></a></li>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              
              return (
                <Link key={item.to} to={item.to}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center space-x-2 "
                  >
                    <Icon className="h-4 w-4" />
                    <span >{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

       
        </div>
      </div>
    </nav>
  );
};

export default Navigation;