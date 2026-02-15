import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sprout, Sun, MapPin, TrendingUp, CloudRain, Thermometer, Wind, AlertCircle, Loader2, Search, Check, BookOpen, DollarSign } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

// API Base URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7860";

const CropRecommendation = () => {
    // State
    const [city, setCity] = useState("");
    const [weatherData, setWeatherData] = useState<any>(null);
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [weatherError, setWeatherError] = useState("");

    // Hidden Soil State (Auto-Inferred)
    const [soilData] = useState({ N: 50, P: 50, K: 50, ph: 6.5 });

    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showResults, setShowResults] = useState(false);

    // Handlers
    const getRecommendations = async (weatherOverride: any = null) => {
        setLoading(true);
        setError("");
        setShowResults(false);

        try {
            // Handle both event (onClick) and direct data pass (auto-fetch)
            // If weatherOverride has 'data' property, use it. Otherwise rely on state.
            let activeWeather = weatherData;
            if (weatherOverride && weatherOverride.data) {
                activeWeather = weatherOverride;
            }

            const temp = activeWeather?.data?.temperature || 25.0;
            const humidity = activeWeather?.data?.humidity || 50.0;
            const rainfall = activeWeather?.data?.rainfall || 100.0;

            const payload = {
                ...soilData,
                city: city || null,
                temperature: temp,
                humidity: humidity,
                rainfall: rainfall
            };

            const response = await fetch(`${API_URL}/recommend`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || "Failed to get recommendations");

            // Transform backend response
            const best = {
                name: data.recommended_crop,
                scientificName: data.scientific_name,
                confidence: data.confidence,
                match: true,
                summary: data.executive_summary || "Highly recommended for current conditions.",
                reasoning: Array.isArray(data.reasoning) ? data.reasoning : [data.reason],
                tips: Array.isArray(data.farming_tips) ? data.farming_tips : [data.advice],
                market: data.market_outlook,
                source: data.source
            };

            const alts = data.alternatives?.map((alt: any) => ({
                name: alt.crop,
                confidence: alt.confidence,
                match: false
            })) || [];

            setRecommendations([best, ...alts]);
            setShowResults(true);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchWeather = async () => {
        if (!city) {
            setWeatherError("Please enter a city name.");
            return;
        }
        setWeatherLoading(true);
        setWeatherError("");
        setWeatherData(null);

        // Clear previous results instantly
        setRecommendations([]);
        setShowResults(false);

        try {
            const response = await fetch(`${API_URL}/weather?city=${city}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || "Failed to fetch weather");
            setWeatherData(data);

        } catch (err: any) {
            setWeatherError(err.message);
        } finally {
            setWeatherLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-blue-50/40 dark:from-green-950/10 dark:via-emerald-950/10 dark:to-blue-950/10">
            <div className="w-full px-4 py-8 max-w-7xl mx-auto">

                {/* Header (Matches Weather.tsx style) */}
                <div className="mb-8 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-950/30 rounded-full mb-4">
                        <Sprout className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900 dark:text-green-100">AI Crop Advisor</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                        Intelligent Crop Recommendation
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Data-driven crop selection based on hyper-local weather and soil analysis.
                    </p>
                </div>

                {/* Search & Location (Matches Weather.tsx Card style) */}
                <Card className="mb-8 border-0 shadow-xl bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-950/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                                <Search className="h-5 w-5 text-white" />
                            </div>
                            Location Analysis
                        </CardTitle>
                        <CardDescription>Enter your farm's location to fetch real-time climate data</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Enter City Name (e.g. Pune, Nagpur)"
                                    className="h-12 text-lg"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
                                />
                            </div>
                            <Button
                                onClick={fetchWeather}
                                disabled={weatherLoading}
                                className="h-12 px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg"
                            >
                                {weatherLoading ? <Loader2 className="animate-spin mr-2" /> : <Sun className="mr-2 h-5 w-5" />}
                                Fetch Data
                            </Button>
                        </div>
                        {weatherError && <p className="text-red-500 mt-2 text-sm">{weatherError}</p>}
                    </CardContent>
                </Card>

                {/* Weather Data Panel (Only shows when available) */}
                <AnimatePresence>
                    {weatherData && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-8"
                        >
                            <div className="flex items-center gap-2 mb-4 px-1">
                                <MapPin className="h-5 w-5 text-green-600" />
                                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                                    Climate Data for <span className="text-slate-900 dark:text-white">{weatherData.location}</span>
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-100">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className="p-3 bg-orange-100 rounded-full text-orange-600"><Thermometer /></div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Temperature</p>
                                            <p className="text-2xl font-bold">{weatherData.data.temperature}°C</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-100">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className="p-3 bg-blue-100 rounded-full text-blue-600"><CloudRain /></div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Rainfall</p>
                                            <p className="text-2xl font-bold">{weatherData.data.rainfall}mm</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-cyan-50 dark:bg-cyan-950/20 border-cyan-100">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className="p-3 bg-cyan-100 rounded-full text-cyan-600"><Wind /></div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Humidity</p>
                                            <p className="text-2xl font-bold">{weatherData.data.humidity}%</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <div className="flex items-center justify-center">
                                    <Button
                                        onClick={getRecommendations}
                                        disabled={loading}
                                        className="w-full h-full min-h-[80px] text-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200"
                                    >
                                        {loading ? <Loader2 className="animate-spin mr-2" /> : <TrendingUp className="mr-2" />}
                                        Analyze Crops
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <Alert variant="destructive" className="mb-8">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Analysis Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* RESULTS SECTION */}
                <AnimatePresence>
                    {showResults && recommendations.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                        >
                            {/* Main Recommendation */}
                            <Card className="lg:col-span-2 border-green-200 shadow-xl overflow-hidden">
                                <div className="bg-green-600 p-6 text-white">
                                    <div className="flex justify-between items-start">
                                        <Badge className="bg-green-400/20 hover:bg-green-400/30 text-white border-0">Top Choice</Badge>
                                        <span className="text-xs opacity-75">{recommendations[0].source}</span>
                                    </div>
                                    <h2 className="text-4xl font-bold mt-2">{recommendations[0].name}</h2>
                                    <p className="italic opacity-90">{recommendations[0].scientificName}</p>
                                    <p className="mt-4 text-lg font-medium opacity-95 leading-snug">
                                        "{recommendations[0].summary}"
                                    </p>
                                </div>
                                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-semibold flex items-center gap-2 mb-3 text-green-700">
                                            <Check className="w-4 h-4" /> Why this crop?
                                        </h3>
                                        <ul className="space-y-2">
                                            {recommendations[0].reasoning?.map((r: string, i: number) => (
                                                <li key={i} className="text-sm text-slate-600 flex gap-2">
                                                    <span className="text-green-500">•</span> {r}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold flex items-center gap-2 mb-3 text-blue-700">
                                            <BookOpen className="w-4 h-4" /> Key Tips
                                        </h3>
                                        <ul className="space-y-2">
                                            {recommendations[0].tips?.map((t: string, i: number) => (
                                                <li key={i} className="text-sm text-slate-600 flex gap-2">
                                                    <span className="text-blue-500">•</span> {t}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {recommendations[0].market && (
                                        <div className="md:col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                                <DollarSign className="w-4 h-4 text-amber-500" />
                                                Market Outlook: <span className="font-normal text-slate-600">{recommendations[0].market}</span>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Alternatives */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg text-slate-800">Alternative Options</h3>
                                {recommendations.slice(1).map((crop, idx) => (
                                    <Card key={idx} className="hover:bg-slate-50 transition-colors cursor-default">
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-lg text-slate-700">{crop.name}</span>
                                                <Badge variant="outline" className="text-green-600 border-green-200">
                                                    {crop.confidence}%
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Viable secondary option</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CropRecommendation;
