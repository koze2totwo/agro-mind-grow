import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Cloud,
  TrendingUp,
  Calendar,
  Bug,
  Wrench,
  Users,
  BookOpen,
  Sprout,
  ArrowRight,
  Sparkles,
  Activity,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useEffect, useState } from "react";

const Index = () => {
  const [counters, setCounters] = useState({
    plants: 0,
    accuracy: 0,
    alerts: 0,
  });

  // Animated counter effect
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targets = {
      plants: 247,
      accuracy: 95,
      alerts: 3,
    };

    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCounters({
        plants: Math.floor((targets.plants * step) / steps),
        accuracy: Math.floor((targets.accuracy * step) / steps),
        alerts: Math.floor((targets.alerts * step) / steps),
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounters(targets);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      to: "/pest-control",
      icon: Bug,
      title: "Disease Prediction",
      description: "AI-powered plant disease detection with 95%+ accuracy",
      color: "from-red-500 to-pink-500",
      gradient: "bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20"
    },
    {
      to: "/weather",
      icon: Cloud,
      title: "Weather Forecast",
      description: "Real-time weather data and climate analysis",
      color: "from-blue-500 to-cyan-500",
      gradient: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20"
    },
    {
      to: "/market-prices",
      icon: TrendingUp,
      title: "Market Intelligence",
      description: "Live crop prices and market trend analysis",
      color: "from-green-500 to-emerald-500",
      gradient: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
    },
    {
      to: "/crop-calendar",
      icon: Calendar,
      title: "Crop Calendar",
      description: "Personalized planting and harvesting schedules",
      color: "from-amber-500 to-orange-500",
      gradient: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20"
    },
    {
      to: "/equipment",
      icon: Wrench,
      title: "Equipment Catalog",
      description: "Modern farming tools and machinery information",
      color: "from-gray-500 to-slate-500",
      gradient: "bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20"
    },
    {
      to: "/crop-recommendation",
      icon: Sprout,
      title: "Crop Recommendation",
      description: "AI-powered crop suggestions based on soil and climate",
      color: "from-green-500 to-emerald-500",
      gradient: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
    },
    {
      to: "/planning",
      icon: Users,
      title: "Expert Consultation",
      description: "Book consultations with agricultural experts",
      color: "from-purple-500 to-violet-500",
      gradient: "bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20"
    },
    {
      to: "/knowledge-base",
      icon: BookOpen,
      title: "Knowledge Base",
      description: "Learn techniques and access government schemes",
      color: "from-emerald-500 to-green-500",
      gradient: "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20"
    }
  ];

  const stats = [
    {
      icon: Sprout,
      label: "Plants Analyzed",
      value: counters.plants,
      suffix: "+",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    {
      icon: CheckCircle2,
      label: "Detection Accuracy",
      value: counters.accuracy,
      suffix: "%",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      icon: AlertCircle,
      label: "Active Alerts",
      value: counters.alerts,
      suffix: "",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50 dark:bg-amber-950/20"
    },
    {
      icon: Activity,
      label: "System Status",
      value: "Live",
      suffix: "",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      isText: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/50 dark:from-green-950/10 dark:via-emerald-950/10 dark:to-teal-950/10">
      {/* Hero Section */}
      <section className="relative py-16 px-4 md:px-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full shadow-lg border border-green-100 dark:border-green-900 mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900 dark:text-green-100">AI-Powered Smart Farming Dashboard</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Welcome to Your Farm
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Monitor your crops, get AI insights, and make data-driven decisions all in one place
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {stats.map((stat, index) => (
              <Card key={index} className={`${stat.bgColor} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group`}>
                <CardContent className="p-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className={`text-4xl md:text-5xl font-bold mb-2 ${stat.isText ? 'text-green-600 dark:text-green-400' : ''}`}>
                    {stat.isText ? (
                      <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2">
                        {stat.value}
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </span>
                    ) : (
                      <span className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                        {stat.value}{stat.suffix}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Quick Access</h2>
            <Link to="/pest-control">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg">
                <Bug className="w-4 h-4 mr-2" />
                Diagnose Plant
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.to}
                  to={feature.to}
                  className="group"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Card className={`h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${feature.gradient} overflow-hidden relative`}>
                    {/* Glow effect on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                    <CardHeader className="relative">
                      <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                      <CardDescription className="text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                      <div className="flex items-center text-green-600 dark:text-green-400 font-medium mt-4 group-hover:translate-x-2 transition-transform">
                        <span className="text-sm">Learn more</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>

            <CardContent className="p-12 text-center relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Need Expert Advice?
              </h3>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Connect with agricultural experts for personalized consultations and farm planning
              </p>
              <Link to="/planning">
                <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100 shadow-xl px-8">
                  Book Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Index;