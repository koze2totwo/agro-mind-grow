import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sprout, Droplets, Sun, MapPin, TrendingUp, Clock, Sparkles } from "lucide-react";

const CropRecommendation = () => {
    const [soilType, setSoilType] = useState("");
    const [weather, setWeather] = useState("");
    const [season, setSeason] = useState("");
    const [location, setLocation] = useState("");
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);

    // Crop database with recommendations
    const cropDatabase = [
        {
            name: "Rice",
            icon: "🌾",
            soils: ["Black Soil", "Clay"],
            weathers: ["Rainy", "Humid"],
            seasons: ["Kharif (Monsoon)"],
            growthPeriod: "120-150 days",
            waterNeed: "High",
            yield: "4-6 tons/hectare",
            confidence: 95,
            description: "Ideal for waterlogged conditions with high rainfall"
        },
        {
            name: "Wheat",
            icon: "🌾",
            soils: ["Loam", "Clay"],
            weathers: ["Moderate", "Cold"],
            seasons: ["Rabi (Winter)"],
            growthPeriod: "120-130 days",
            waterNeed: "Medium",
            yield: "3-4 tons/hectare",
            confidence: 92,
            description: "Best suited for cool climate with moderate irrigation"
        },
        {
            name: "Cotton",
            icon: "🌿",
            soils: ["Black Soil", "Red Soil"],
            weathers: ["Hot & Dry", "Moderate"],
            seasons: ["Kharif (Monsoon)"],
            growthPeriod: "150-180 days",
            waterNeed: "Medium",
            yield: "2-3 tons/hectare",
            confidence: 88,
            description: "Thrives in warm climate with well-drained soil"
        },
        {
            name: "Sugarcane",
            icon: "🎋",
            soils: ["Black Soil", "Red Soil", "Loam"],
            weathers: ["Humid", "Hot & Dry"],
            seasons: ["Kharif (Monsoon)", "Rabi (Winter)", "Zaid (Summer)"],
            growthPeriod: "300-360 days",
            waterNeed: "High",
            yield: "70-80 tons/hectare",
            confidence: 90,
            description: "Year-round crop requiring abundant water and warm climate"
        },
        {
            name: "Maize",
            icon: "🌽",
            soils: ["Loam", "Sandy", "Red Soil"],
            weathers: ["Moderate", "Hot & Dry"],
            seasons: ["Kharif (Monsoon)", "Rabi (Winter)"],
            growthPeriod: "80-110 days",
            waterNeed: "Medium",
            yield: "3-5 tons/hectare",
            confidence: 87,
            description: "Versatile crop adaptable to various soil types"
        },
        {
            name: "Pulses (Dal)",
            icon: "🫘",
            soils: ["Loam", "Black Soil", "Red Soil"],
            weathers: ["Moderate", "Cold"],
            seasons: ["Rabi (Winter)", "Zaid (Summer)"],
            growthPeriod: "90-120 days",
            waterNeed: "Low",
            yield: "1-2 tons/hectare",
            confidence: 85,
            description: "Nitrogen-fixing crop suitable for diverse conditions"
        },
        {
            name: "Vegetables",
            icon: "🥬",
            soils: ["Loam", "Sandy"],
            weathers: ["Moderate", "Cold"],
            seasons: ["Rabi (Winter)", "Zaid (Summer)"],
            growthPeriod: "60-90 days",
            waterNeed: "Medium",
            yield: "15-25 tons/hectare",
            confidence: 89,
            description: "Quick-growing crops with high market value"
        },
        {
            name: "Groundnut",
            icon: "🥜",
            soils: ["Sandy", "Loam"],
            weathers: ["Hot & Dry", "Moderate"],
            seasons: ["Kharif (Monsoon)", "Zaid (Summer)"],
            growthPeriod: "100-130 days",
            waterNeed: "Medium",
            yield: "2-3 tons/hectare",
            confidence: 86,
            description: "Oilseed crop preferring well-drained sandy soils"
        }
    ];

    const handleRecommendation = () => {
        if (!soilType || !weather || !season) {
            return;
        }

        // Filter crops based on user inputs
        const filtered = cropDatabase.filter(crop => {
            const soilMatch = crop.soils.includes(soilType);
            const weatherMatch = crop.weathers.includes(weather);
            const seasonMatch = crop.seasons.includes(season);

            // Calculate match score
            let matchScore = 0;
            if (soilMatch) matchScore += 40;
            if (weatherMatch) matchScore += 35;
            if (seasonMatch) matchScore += 25;

            return matchScore >= 60; // At least 2 criteria must match
        });

        // Sort by confidence
        const sorted = filtered.sort((a, b) => b.confidence - a.confidence);
        setRecommendations(sorted);
        setShowResults(true);
    };

    const handleReset = () => {
        setSoilType("");
        setWeather("");
        setSeason("");
        setLocation("");
        setRecommendations([]);
        setShowResults(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-blue-50/40 dark:from-green-950/10 dark:via-emerald-950/10 dark:to-blue-950/10">
            <div className="w-full px-4 py-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-950/30 rounded-full mb-4 animate-fade-in">
                        <Sprout className="w-4 h-4 text-green-600 animate-pulse" />
                        <span className="text-sm font-medium text-green-900 dark:text-green-100">AI-Powered Recommendations</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-green-600 via-emerald-500 to-blue-500 bg-clip-text text-transparent animate-fade-in">
                        Crop Recommendation System
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Get intelligent crop suggestions based on your soil, weather, and season
                    </p>
                </div>

                {/* Input Form */}
                <Card className="mb-8 border-0 shadow-xl bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-950/20 hover:shadow-2xl transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            Enter Your Farm Details
                        </CardTitle>
                        <CardDescription>Provide information about your farming conditions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Soil Type */}
                            <div>
                                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-green-600" />
                                    Soil Type
                                </label>
                                <Select value={soilType} onValueChange={setSoilType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select soil type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Loam">Loam Soil</SelectItem>
                                        <SelectItem value="Clay">Clay Soil</SelectItem>
                                        <SelectItem value="Sandy">Sandy Soil</SelectItem>
                                        <SelectItem value="Red Soil">Red Soil</SelectItem>
                                        <SelectItem value="Black Soil">Black Soil</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Weather */}
                            <div>
                                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                                    <Sun className="w-4 h-4 text-yellow-600" />
                                    Weather Condition
                                </label>
                                <Select value={weather} onValueChange={setWeather}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select weather" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Hot & Dry">Hot & Dry</SelectItem>
                                        <SelectItem value="Moderate">Moderate</SelectItem>
                                        <SelectItem value="Cold">Cold</SelectItem>
                                        <SelectItem value="Rainy">Rainy</SelectItem>
                                        <SelectItem value="Humid">Humid</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Season */}
                            <div>
                                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    Season
                                </label>
                                <Select value={season} onValueChange={setSeason}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select season" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Kharif (Monsoon)">Kharif (Monsoon) - Jun to Oct</SelectItem>
                                        <SelectItem value="Rabi (Winter)">Rabi (Winter) - Nov to Mar</SelectItem>
                                        <SelectItem value="Zaid (Summer)">Zaid (Summer) - Apr to Jun</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-red-600" />
                                    Location (Optional)
                                </label>
                                <Input
                                    placeholder="Enter your city/state"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 mt-6">
                            <Button
                                onClick={handleRecommendation}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg flex-1"
                                disabled={!soilType || !weather || !season}
                            >
                                <TrendingUp className="mr-2 h-4 w-4" />
                                Get Recommendations
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleReset}
                                className="border-2 border-green-600 text-green-700 hover:bg-green-50"
                            >
                                Reset
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                {showResults && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Sprout className="w-6 h-6 text-green-600" />
                            Recommended Crops ({recommendations.length})
                        </h2>

                        {recommendations.length === 0 ? (
                            <Card className="p-12 text-center border-0 shadow-lg bg-gradient-to-br from-white to-green-50">
                                <p className="text-muted-foreground text-lg">
                                    No crops match your current conditions. Try adjusting your selections.
                                </p>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recommendations.map((crop, idx) => (
                                    <Card
                                        key={idx}
                                        className="group border-0 shadow-lg bg-gradient-to-br from-white to-green-50/50 dark:from-gray-800 dark:to-green-950/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden animate-fade-in"
                                        style={{ animationDelay: `${0.1 * idx}s` }}
                                    >
                                        <CardHeader>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">
                                                    {crop.icon}
                                                </div>
                                                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                                    {crop.confidence}% Match
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-xl group-hover:text-green-600 transition-colors">
                                                {crop.name}
                                            </CardTitle>
                                            <CardDescription className="text-sm">
                                                {crop.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="w-4 h-4 text-blue-600" />
                                                <span className="font-medium">Growth:</span>
                                                <span className="text-muted-foreground">{crop.growthPeriod}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Droplets className="w-4 h-4 text-cyan-600" />
                                                <span className="font-medium">Water:</span>
                                                <span className="text-muted-foreground">{crop.waterNeed}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <TrendingUp className="w-4 h-4 text-green-600" />
                                                <span className="font-medium">Yield:</span>
                                                <span className="text-muted-foreground">{crop.yield}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CropRecommendation;
