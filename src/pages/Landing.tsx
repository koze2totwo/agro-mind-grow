import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Sparkles,
    ArrowRight,
    Leaf,
    Sprout,
    Brain,
    Cloud,
    TrendingUp,
    ShieldCheck,
    Zap,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Linkedin
} from "lucide-react";
import { useEffect, useState } from "react";

const Landing = () => {
    const [scrollY, setScrollY] = useState(0);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: Brain,
            title: "AI-Powered Diagnosis",
            description: "Advanced machine learning models detect plant diseases with 95%+ accuracy"
        },
        {
            icon: Sprout,
            title: "Crop Recommendation",
            description: "Intelligent crop suggestions based on soil type, weather, and seasonal conditions"
        },
        {
            icon: Cloud,
            title: "Real-Time Weather",
            description: "Hyperlocal weather forecasts and climate insights for better planning"
        },
        {
            icon: TrendingUp,
            title: "Market Intelligence",
            description: "Live market prices and trend analysis to maximize your profits"
        },
        {
            icon: ShieldCheck,
            title: "Expert Guidance",
            description: "Personalized recommendations from agricultural experts"
        }
    ];

    const stats = [
        { value: "95%", label: "Accuracy Rate" },
        { value: "38+", label: "Crop Diseases" },
        { value: "24/7", label: "Support" }
    ];

    const products = [
        { name: "Disease Prediction", link: "/login" },
        { name: "Crop Recommendation", link: "/login" },
        { name: "Weather Forecast", link: "/login" },
        { name: "Market Prices", link: "/login" },
        { name: "Crop Calendar", link: "/login" }
    ];

    const services = [
        { name: "Expert Consultation", link: "/login" },
        { name: "Farm Planning", link: "/login" },
        { name: "Equipment Catalog", link: "/login" },
        { name: "Knowledge Base", link: "/login" }
    ];

    return (
        <div className="min-h-screen bg-background overflow-hidden">
            {/* Navigation Bar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg' : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                                <Leaf className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                AgroMind Grow
                            </span>
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-green-600 transition-colors">
                                Features
                            </a>
                            <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-green-600 transition-colors">
                                About
                            </a>
                            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-green-600 transition-colors">
                                Contact
                            </a>
                            <Link to="/login">
                                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg">
                                    Login
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile Login Button */}
                        <Link to="/login" className="md:hidden">
                            <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                                Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-teal-950/20">
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/30 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    </div>
                </div>

                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-green-500/20 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animation: `float ${5 + Math.random() * 10}s infinite ease-in-out`,
                                animationDelay: `${Math.random() * 5}s`
                            }}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div
                        className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-green-100 animate-fade-in"
                        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
                    >
                        <Sparkles className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">Next-Gen Smart Agriculture Platform</span>
                    </div>

                    <h1
                        className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in"
                        style={{ animationDelay: '0.1s' }}
                    >
                        <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                            AgroMind Grow
                        </span>
                    </h1>

                    <p
                        className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto animate-fade-in"
                        style={{ animationDelay: '0.2s' }}
                    >
                        Empowering farmers with <span className="font-semibold text-green-600">AI-driven insights</span>,{" "}
                        real-time data, and expert guidance
                    </p>

                    <p
                        className="text-lg text-muted-foreground/80 mb-12 max-w-2xl mx-auto animate-fade-in"
                        style={{ animationDelay: '0.3s' }}
                    >
                        Transform your farming with cutting-edge technology. Make smarter decisions, increase yields, and maximize profits.
                    </p>

                    <div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in"
                        style={{ animationDelay: '0.4s' }}
                    >
                        <Link to="/login">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-xl shadow-green-500/30 px-8 py-6 text-lg group"
                            >
                                Get Started
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-2 border-green-600 text-green-700 hover:bg-green-50 px-8 py-6 text-lg"
                        >
                            <Zap className="mr-2 h-5 w-5" />
                            Watch Demo
                        </Button>
                    </div>

                    {/* Stats */}
                    <div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in"
                        style={{ animationDelay: '0.5s' }}
                    >
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Animated Light Green Beetles */}
                <div className="absolute bottom-20 left-10 animate-float-slow">
                    {/* Beetle 1 - Ladybug style */}
                    <div className="relative w-16 h-16">
                        {/* Body */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-300 to-green-400 dark:from-green-500/40 dark:to-green-600/40 rounded-full opacity-70"></div>
                        {/* Head */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-green-400 dark:bg-green-600/40 rounded-full opacity-70"></div>
                        {/* Spots */}
                        <div className="absolute top-4 left-3 w-3 h-3 bg-green-600/40 dark:bg-green-700/30 rounded-full"></div>
                        <div className="absolute top-4 right-3 w-3 h-3 bg-green-600/40 dark:bg-green-700/30 rounded-full"></div>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-green-600/40 dark:bg-green-700/30 rounded-full"></div>
                        {/* Wing line */}
                        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-green-600/30 dark:bg-green-700/20"></div>
                    </div>
                </div>
                <div className="absolute top-40 right-20 animate-float-slower" style={{ animationDelay: '2s' }}>
                    {/* Beetle 2 - Smaller bug */}
                    <div className="relative w-12 h-12">
                        {/* Body */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-300 to-emerald-400 dark:from-emerald-500/40 dark:to-emerald-600/40 rounded-full opacity-70"></div>
                        {/* Head */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-emerald-400 dark:bg-emerald-600/40 rounded-full opacity-70"></div>
                        {/* Antennae */}
                        <div className="absolute -top-4 left-3 w-0.5 h-3 bg-emerald-500/50 dark:bg-emerald-600/30 rotate-[-30deg] origin-bottom"></div>
                        <div className="absolute -top-4 right-3 w-0.5 h-3 bg-emerald-500/50 dark:bg-emerald-600/30 rotate-[30deg] origin-bottom"></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white dark:bg-gray-900 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Smart AI-Based Agriculture Platform</span>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to run a successful modern farm, all in one intelligent platform
                        </p>
                    </div>

                    {/* First row - 3 features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        {features.slice(0, 3).map((feature, index) => (
                            <Link to="/login" key={index}>
                                <div
                                    className="group p-6 rounded-2xl bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-950/20 border border-green-100 dark:border-green-900 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <feature.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-green-600 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Second row - 2 features centered */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        {features.slice(3, 5).map((feature, index) => (
                            <Link to="/login" key={index + 3}>
                                <div
                                    className="group p-6 rounded-2xl bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-950/20 border border-green-100 dark:border-green-900 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                                    style={{ animationDelay: `${(index + 3) * 0.1}s` }}
                                >
                                    <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <feature.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-green-600 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="about" className="py-24 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to Transform Your Farming?
                    </h2>
                    <p className="text-xl mb-8 text-white/90">
                        Join thousands of farmers who are already using AgroMind Grow to increase yields and maximize profits
                    </p>
                    <Link to="/login">
                        <Button
                            size="lg"
                            className="bg-white text-green-700 hover:bg-gray-100 shadow-xl px-8 py-6 text-lg group"
                        >
                            Start Your Journey
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Enhanced Footer */}
            <footer id="contact" className="py-16 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        {/* About Section */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                                    <Leaf className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-xl font-semibold">AgroMind Grow</span>
                            </div>
                            <p className="text-gray-400 mb-4">
                                Empowering farmers with AI-driven insights for sustainable and profitable farming.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors">
                                    <Facebook className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors">
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Products */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Products</h3>
                            <ul className="space-y-3">
                                {products.map((product, index) => (
                                    <li key={index}>
                                        <Link to={product.link} className="text-gray-400 hover:text-green-400 transition-colors">
                                            {product.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Services</h3>
                            <ul className="space-y-3">
                                {services.map((service, index) => (
                                    <li key={index}>
                                        <Link to={service.link} className="text-gray-400 hover:text-green-400 transition-colors">
                                            {service.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-green-400 mt-0.5" />
                                    <span className="text-gray-400">support@agromindgrow.com</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-green-400 mt-0.5" />
                                    <span className="text-gray-400">+1 (555) 123-4567</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-green-400 mt-0.5" />
                                    <span className="text-gray-400">123 Farm Road, Agriculture City, AC 12345</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-800 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-gray-400 text-sm">© 2026 AgroMind Grow. All rights reserved.</p>
                            <div className="flex gap-6 text-sm">
                                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Privacy Policy</a>
                                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Terms of Service</a>
                                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Cookie Policy</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(12px); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
        </div>
    );
};

export default Landing;
