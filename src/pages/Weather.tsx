import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cloud, Sun, CloudRain, CloudLightning, Droplets, Wind, Eye, Search, Leaf } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchWeatherByCity, codeToCondition, WeatherResult } from "@/lib/weather";

function countryCodeFromValue(v: string): string | undefined {
  switch (v) {
    case "india":
      return "IN";
    case "usa":
      return "US";
    case "uk":
      return "GB";
    default:
      return undefined;
  }
}

const Weather = () => {
  const [cityInput, setCityInput] = useState("Delhi");
  const [country, setCountry] = useState("india");
  const [queryCity, setQueryCity] = useState("Delhi");
  const [data, setData] = useState<WeatherResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetchWeatherByCity(queryCity, countryCodeFromValue(country))
      .then((res) => {
        if (cancelled) return;
        setData(res);
      })
      .catch((e: any) => {
        if (cancelled) return;
        setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, [queryCity, country]);

  const current = data?.current;
  const forecast = data?.forecast ?? [];

  function handleSearch() {
    if (!cityInput.trim()) return;
    setIsFetching(true);
    setQueryCity(cityInput.trim());
    // isFetching will be reset once effect finishes
    setTimeout(() => setIsFetching(false), 500);
  }

  function codeToIcon(code: number) {
    if (code === 0) return Sun;
    if ([1, 2, 3].includes(code)) return Cloud;
    if ([45, 48].includes(code)) return Cloud;
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return CloudRain;
    if ([95, 96, 99].includes(code)) return CloudLightning;
    return Cloud;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-cyan-50/30 to-sky-50/50 dark:from-blue-950/10 dark:via-cyan-950/10 dark:to-sky-950/10">

      <div className="w-full px-4 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-950/30 rounded-full mb-4">
            <Cloud className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Real-Time Weather Data</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-500 bg-clip-text text-transparent">
            Weather & Climate
          </h1>
          <p className="text-muted-foreground text-lg">
            Hyperlocal weather forecasts and climate insights for smarter farming decisions
          </p>
        </div>

        {/* Location Search */}
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-950/20 hover:shadow-2xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <Search className="h-5 w-5 text-white" />
              </div>
              Location Search
            </CardTitle>
            <CardDescription>Search for any city worldwide to get weather data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Enter city name"
                className="flex-1"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
              />
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="usa">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleSearch}
                disabled={isFetching}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              >
                {isFetching ? "Searching..." : "Search"}
              </Button>
            </div>
            <div className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              Try examples: Delhi, Mumbai, Kolkata, Chennai, Bengaluru
            </div>
          </CardContent>
        </Card>

        {/* Current Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 border-0 shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-950/20">
            <CardHeader>
              <CardTitle className="text-2xl">Current Weather</CardTitle>
              <CardDescription className="text-base">
                {isLoading ? "Loading..." : (error ? "" : current?.locationLabel)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
                  <p className="text-red-700 dark:text-red-400">{(error as Error)?.message || "Failed to load weather"}</p>
                </div>
              )}
              {!error && (
                <div>
                  <div className="flex items-center justify-between mb-8 p-6 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-2xl">
                    <div>
                      <div className="text-7xl font-bold bg-gradient-to-br from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        {isLoading ? "--" : `${current?.temperatureC ?? "--"}°`}
                      </div>
                      <div className="text-xl text-muted-foreground mt-2 font-medium">
                        {isLoading ? "" : codeToCondition(current?.conditionCode ?? 0)}
                      </div>
                    </div>
                    <Cloud className="h-32 w-32 text-blue-400 opacity-50" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl hover:scale-105 transition-transform">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Droplets className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Humidity</div>
                        <div className="font-bold text-lg">{isLoading ? "--" : `${current?.humidityPercent ?? "--"}%`}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-xl hover:scale-105 transition-transform">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <Wind className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Wind Speed</div>
                        <div className="font-bold text-lg">{isLoading ? "--" : `${current?.windSpeedKmh ?? "--"} km/h`}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl hover:scale-105 transition-transform">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Visibility</div>
                        <div className="font-bold text-lg">{current?.visibilityKm ?? "--"} km</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl hover:scale-105 transition-transform">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <Sun className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">UV Index</div>
                        <div className="font-bold text-lg">{current?.uvIndex ?? "--"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Leaf className="h-4 w-4 text-white" />
                </div>
                Farming Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border border-green-200 dark:border-green-900">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-1 flex items-center gap-2">
                  <Droplets className="w-4 h-4" />
                  Irrigation Conditions
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">Current conditions are ideal for irrigation activities</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 rounded-xl border border-yellow-200 dark:border-yellow-900">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1 flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  UV Protection
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">Moderate UV levels - consider shade for sensitive crops</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl border border-blue-200 dark:border-blue-900">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1 flex items-center gap-2">
                  <Wind className="w-4 h-4" />
                  Wind Favorable
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">Good natural ventilation for crops</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 5-Day Forecast */}
        <Card className="mb-8 border-0 shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-white to-sky-50 dark:from-gray-800 dark:to-sky-950/20">
          <CardHeader>
            <CardTitle className="text-2xl">5-Day Forecast</CardTitle>
            <CardDescription>Plan your farming activities with confidence</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {forecast.map((day, index) => {
                const Icon = codeToIcon(day.conditionCode);
                return (
                  <div
                    key={index}
                    className="group text-center p-5 rounded-2xl bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-950/20 border border-blue-100 dark:border-blue-900 hover:shadow-lg hover:-translate-y-1 transition-all"
                  >
                    <div className="font-semibold mb-3 text-sm">{day.dayLabel}</div>
                    <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">{codeToCondition(day.conditionCode)}</div>
                    <div className="font-bold text-lg">
                      <span className="text-orange-600">{day.highC}°</span>
                      <span className="text-muted-foreground mx-1">/</span>
                      <span className="text-blue-600">{day.lowC}°</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Agricultural Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Agricultural Weather Alerts</CardTitle>
            <CardDescription>Important weather notifications for farmers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-green-500 bg-green-50">
                <h4 className="font-semibold text-green-800">Favorable Planting Conditions</h4>
                <p className="text-green-700">Next 3 days show ideal temperature and humidity for rice plantation</p>
                <p className="text-sm text-green-600 mt-1">
                  Valid until: {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                <h4 className="font-semibold text-orange-800">Heat Wave Warning</h4>
                <p className="text-orange-700">Expected high temperatures next week. Increase irrigation frequency</p>
                <p className="text-sm text-orange-600 mt-1">
                  Valid from: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Weather;