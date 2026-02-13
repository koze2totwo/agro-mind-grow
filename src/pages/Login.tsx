import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, Leaf, Brain, Sprout, Sparkles } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [shake, setShake] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    const from = location.state?.from?.pathname || "/dashboard";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const success = await login(email, password);

        if (success) {
            toast({
                title: "Welcome back!",
                description: "You've successfully logged in.",
            });
            navigate(from, { replace: true });
        } else {
            setShake(true);
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: "Invalid email or password. Please try again.",
            });
            setTimeout(() => setShake(false), 500);
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Animated Content (SWAPPED!) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                {/* Floating Plant Leaves */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(15)].map((_, i) => (
                        <Leaf
                            key={i}
                            className="absolute text-white/10"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                width: `${30 + Math.random() * 40}px`,
                                height: `${30 + Math.random() * 40}px`,
                                animation: `float ${8 + Math.random() * 12}s infinite ease-in-out`,
                                animationDelay: `${Math.random() * 5}s`,
                                transform: `rotate(${Math.random() * 360}deg)`
                            }}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white text-center">
                    <div className="mb-8">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-6 mx-auto animate-float">
                            <Brain className="w-12 h-12 text-white" />
                        </div>
                        <Sparkles className="w-8 h-8 mx-auto mb-4 animate-pulse" />
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        AI-Powered<br />Smart Farming
                    </h2>

                    <p className="text-xl text-white/90 mb-8 max-w-md">
                        Transform your agricultural practices with cutting-edge artificial intelligence and data-driven insights
                    </p>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
                                <Sprout className="w-6 h-6" />
                            </div>
                            <p className="font-semibold">Disease Detection</p>
                            <p className="text-sm text-white/80">95% Accuracy</p>
                        </div>

                        <div className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
                                <Brain className="w-6 h-6" />
                            </div>
                            <p className="font-semibold">AI Insights</p>
                            <p className="text-sm text-white/80">Real-time</p>
                        </div>
                    </div>

                    {/* Rotating Text */}
                    <div className="flex items-center gap-2 text-sm text-white/80">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span>Join 10,000+ farmers using AgroMind Grow</span>
                    </div>
                </div>

                {/* Decorative Plants */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Right Side - Login Form (SWAPPED!) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 mb-8 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                            <Leaf className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            AgroMind Grow
                        </span>
                    </Link>

                    {/* Welcome Text */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome Back!</h1>
                        <p className="text-muted-foreground">Sign in to access your AI-powered farm dashboard</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className={`space-y-6 ${shake ? 'animate-shake' : ''}`}>
                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="farmer@mail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded border-gray-300" />
                                <span className="text-muted-foreground">Remember me</span>
                            </label>
                            <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg h-12 text-lg"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Signing In...
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-8 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                        <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">Demo Credentials:</p>
                        <div className="text-sm space-y-1 text-green-800 dark:text-green-200">
                            <p>Email: <span className="font-mono">farmer@mail.com</span></p>
                            <p>Password: <span className="font-mono">1234</span></p>
                        </div>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-6 text-center">
                        <Link to="/" className="text-sm text-muted-foreground hover:text-green-600 transition-colors">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default Login;
