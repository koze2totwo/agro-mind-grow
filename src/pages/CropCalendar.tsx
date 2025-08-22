import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalIcon, Sprout, Scissors, Droplets, Sun, MapPin, CheckCircle2, AlertTriangle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { fetchWeatherByCity } from "@/lib/weather";
import { CROPS, evaluateSowingReadiness, getCropByName, monthName, getStageForMonth } from "@/lib/crops";

const CropCalendar = () => {
  const seasons = {
    kharif: {
      name: "Kharif Season",
      period: "June - November",
      description: "Monsoon crops sown in summer and harvested in autumn",
      color: "bg-green-100 text-green-800"
    },
    rabi: {
      name: "Rabi Season", 
      period: "November - April",
      description: "Winter crops sown after monsoon and harvested in spring",
      color: "bg-blue-100 text-blue-800"
    },
    zaid: {
      name: "Zaid Season",
      period: "April - June", 
      description: "Summer crops grown with irrigation during hot season",
      color: "bg-yellow-100 text-yellow-800"
    }
  };

  const [city, setCity] = useState<string>("");
  const [stateName, setStateName] = useState<string>("");
  const [crop, setCrop] = useState<string>("");
  // Applied filters (only change after user clicks Apply)
  const [appliedCity, setAppliedCity] = useState<string>("");
  const [appliedState, setAppliedState] = useState<string>("");
  const [appliedCrop, setAppliedCrop] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [avgTemp, setAvgTemp] = useState<number | undefined>(undefined);
  const [sumRain, setSumRain] = useState<number | undefined>(undefined);
  const [forecast, setForecast] = useState<{ day: string; rain?: number; high: number; low: number }[]>([]);

  const INDIAN_STATES = [
    'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jammu and Kashmir','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Chandigarh','Ladakh','Puducherry'
  ];

  // Do not auto-load on mount; only after Apply

  async function load(placeOverride?: string) {
    try {
      setLoading(true); setError(null);
      const place = placeOverride ?? [appliedCity, appliedState].filter(Boolean).join(', ');
      if (!appliedCrop) { setLoading(false); return; }
      const w = await fetchWeatherByCity(place || appliedState || appliedCity || 'India');
      const temps = w.forecast.map((d) => d.highC);
      const avg = temps.length ? temps.reduce((a, b) => a + b, 0) / temps.length : undefined;
      setAvgTemp(avg);
      const rain = w.forecast.map((d) => d.precipitationMm || 0).reduce((a, b) => a + b, 0);
      setSumRain(rain);
      setForecast(w.forecast.map((d) => ({ day: d.dayLabel, rain: d.precipitationMm, high: d.highC, low: d.lowC })));
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch weather');
      setAvgTemp(undefined); setSumRain(undefined);
    } finally {
      setLoading(false);
    }
  }

  const selectedCrop = appliedCrop ? getCropByName(appliedCrop) : undefined;
  const month = new Date().getMonth() + 1;
  const readiness = useMemo(
    () => selectedCrop ? evaluateSowingReadiness(selectedCrop, { currentMonth: month, next7DayAvgTempC: avgTemp, next7DayTotalRainMm: sumRain }) : { sowingRecommended: false, reasons: [] },
    [selectedCrop, month, avgTemp, sumRain]
  );
  const currentStage = useMemo(() => selectedCrop ? getStageForMonth(selectedCrop, month) : 'Off-season', [selectedCrop, month]);
  const monthLabel = useMemo(() => new Date().toLocaleString(undefined, { month: 'long', year: 'numeric' }), []);

  type Task = { crop: string; task: string; priority: 'High' | 'Medium' | 'Low'; daysLeft: number };
  const tasks: Task[] = useMemo(() => {
    if (!selectedCrop) return [];
    const list: Task[] = [];
    const [tMin, tMax] = selectedCrop.preferredTemperatureC;
    const temp = typeof avgTemp === 'number' ? Math.round(avgTemp) : undefined;
    const rain = typeof sumRain === 'number' ? Math.round(sumRain) : undefined;

    if (currentStage === 'Sowing') {
      list.push({ crop: selectedCrop.name, task: 'Land preparation & sowing', priority: readiness.sowingRecommended ? 'High' : 'Medium', daysLeft: 5 });
      list.push({ crop: selectedCrop.name, task: 'Seed treatment and nursery management', priority: 'Medium', daysLeft: 7 });
    } else if (currentStage === 'Growing') {
      list.push({ crop: selectedCrop.name, task: 'Irrigation & fertilizer application', priority: 'Medium', daysLeft: 6 });
      list.push({ crop: selectedCrop.name, task: 'Weed control & pest scouting', priority: 'Medium', daysLeft: 4 });
    } else if (currentStage === 'Harvest') {
      list.push({ crop: selectedCrop.name, task: 'Harvest planning & labor arrangement', priority: 'High', daysLeft: 5 });
      list.push({ crop: selectedCrop.name, task: 'Drying, storage and market preparation', priority: 'Medium', daysLeft: 10 });
    } else {
      list.push({ crop: selectedCrop.name, task: 'Next season planning & seed procurement', priority: 'Low', daysLeft: 15 });
    }

    // Weather-adjusted tasks
    if (rain != null && rain >= 25) {
      list.unshift({ crop: selectedCrop.name, task: 'Delay irrigation; ensure drainage due to forecast rain', priority: 'High', daysLeft: 3 });
    } else if (rain != null && rain <= 5 && currentStage !== 'Harvest') {
      list.unshift({ crop: selectedCrop.name, task: 'Irrigation recommended; low rainfall expected', priority: 'High', daysLeft: 3 });
    }
    if (temp != null && temp > tMax + 3 && currentStage !== 'Harvest') {
      list.push({ crop: selectedCrop.name, task: 'Heat stress mitigation (mulch/shade where applicable)', priority: 'Medium', daysLeft: 5 });
    }
    if (temp != null && temp < tMin - 3) {
      list.push({ crop: selectedCrop.name, task: 'Protect seedlings from cold (cover/irrigate lightly)', priority: 'Medium', daysLeft: 5 });
    }
    return list;
  }, [selectedCrop, currentStage, readiness.sowingRecommended, avgTemp, sumRain]);

  const advisories = useMemo(() => {
    if (!selectedCrop) return [] as { title: string; body: string; tone: 'warn' | 'good' }[];
    const items: { title: string; body: string; tone: 'warn' | 'good' }[] = [];
    const [tMin, tMax] = selectedCrop.preferredTemperatureC;
    if (typeof sumRain === 'number') {
      if (sumRain >= 35) items.push({ title: 'Heavy Rainfall Warning', body: 'High rain expected in the next 7 days. Field work and harvesting may be delayed; ensure drainage and lodge-prone crops support.', tone: 'warn' });
      else if (sumRain >= 10) items.push({ title: 'Favorable Moisture', body: 'Good rainfall expected; suitable soil moisture for sowing and fertilizer application.', tone: 'good' });
      else items.push({ title: 'Low Rainfall', body: 'Very low rain expected; plan irrigation scheduling accordingly.', tone: 'warn' });
    }
    if (typeof avgTemp === 'number') {
      if (avgTemp > tMax + 3) items.push({ title: 'High Temperature Advisory', body: `Avg temp ${Math.round(avgTemp)}°C exceeds ideal ${tMin}-${tMax}°C; consider mulching and evening irrigation.`, tone: 'warn' });
      else if (avgTemp < tMin - 3) items.push({ title: 'Low Temperature Advisory', body: `Avg temp ${Math.round(avgTemp)}°C below ideal ${tMin}-${tMax}°C; protect young plants from cold stress.`, tone: 'warn' });
    }
    if (items.length === 0) items.push({ title: 'Favorable Conditions', body: 'Weather outlook supports regular schedule for the coming week.', tone: 'good' });
    return items;
  }, [sumRain, avgTemp, selectedCrop]);

  const monthlyTasks = [
    {
      month: "March 2024",
      tasks: [
        { crop: "Wheat", task: "Apply final irrigation", priority: "High", daysLeft: 5 },
        { crop: "Mustard", task: "Prepare for harvesting", priority: "Medium", daysLeft: 10 },
        { crop: "Potato", task: "Market preparation", priority: "Low", daysLeft: 15 }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Crop Calendar & Planning</h1>
          <p className="text-muted-foreground text-lg">
            Plan your farming activities with seasonal crop schedules
          </p>
        </div>

        {/* Season Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(seasons).map(([key, season]) => (
            <Card key={key}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{season.name}</CardTitle>
                  <Badge className={season.color}>{season.period}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{season.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filter Crop Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={crop} onValueChange={setCrop}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a crop" />
                </SelectTrigger>
                <SelectContent>
                  {CROPS.map((c) => (
                    <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={stateName} onValueChange={setStateName}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <input className="w-full border rounded px-3 py-2" placeholder="City (optional)" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              
              <Button onClick={() => { setAppliedCity(city); setAppliedState(stateName); setAppliedCrop(crop); void load([city, stateName].filter(Boolean).join(', ')); }} disabled={loading || !crop}>Apply</Button>
            </div>
          </CardContent>
        </Card>

        {/* Crop Schedule */}
        <div className="grid gap-6 mb-8">
          {!selectedCrop ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select a crop to view its schedule</CardTitle>
              </CardHeader>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedCrop!.name}</CardTitle>
                    <CardDescription>
                      {selectedCrop!.season} Season • Duration: {selectedCrop!.durationDays[0]}-{selectedCrop!.durationDays[1]} days
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{getStageForMonth(selectedCrop!, month)}</Badge>
                    <div className="text-sm text-muted-foreground mt-1">
                      Water Req: {selectedCrop!.waterNeed}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Sprout className="h-4 w-4 text-green-600" />
                      Sowing Period
                    </h4>
                    <div className="space-y-1">
                      {selectedCrop!.sowingMonths.map((m, idx) => (
                        <Badge key={idx} variant="secondary">{monthName(m)}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Scissors className="h-4 w-4 text-orange-600" />
                      Harvesting Period
                    </h4>
                    <div className="space-y-1">
                      {selectedCrop!.harvestingMonths.map((m, idx) => (
                        <Badge key={idx} variant="secondary">{monthName(m)}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Sowing Readiness (Next 7 days)</h4>
                    {error && <div className="text-destructive text-sm">{error}</div>}
                    {!error && (
                    <div className="space-y-2">
                        <div className={`flex items-center gap-2 text-sm ${readiness.sowingRecommended ? 'text-green-700' : 'text-yellow-700'}`}>
                          {readiness.sowingRecommended ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                          {readiness.sowingRecommended ? 'Favorable for sowing' : 'Sowing not ideal'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {readiness.reasons.join(' · ')}
                        </div>
                        <div className="text-xs mt-2">
                          Rain (7d): {typeof sumRain === 'number' ? `${Math.round(sumRain)} mm` : 'N/A'}
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-xs">
                          {forecast.map((f, i) => (
                            <div key={i} className="p-1 border rounded">
                              <div className="font-medium">{f.day}</div>
                              <div>{f.rain != null ? `${f.rain} mm` : '-'}</div>
                              <div>{f.high}°/{f.low}°</div>
                            </div>
                          ))}
                          </div>
                    </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Monthly Tasks (dynamic) */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalIcon className="h-5 w-5" />
              This Month's Tasks
            </CardTitle>
            <CardDescription>Important activities for {monthLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedCrop ? (
              <div className="text-sm text-muted-foreground">Select a crop to generate tasks.</div>
            ) : (
                <div className="space-y-3">
              {tasks.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                    <h4 className="font-medium">{t.crop}</h4>
                    <p className="text-sm text-muted-foreground">{t.task}</p>
                      </div>
                      <div className="text-right">
                    <Badge variant={t.priority === 'High' ? 'destructive' : t.priority === 'Medium' ? 'default' : 'secondary'}>
                      {t.priority}
                        </Badge>
                    <div className="text-sm text-muted-foreground mt-1">{t.daysLeft} days left</div>
                      </div>
                    </div>
                  ))}
                </div>
            )}
          </CardContent>
        </Card>

        {/* Weather Impact (dynamic) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Weather Impact on Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedCrop ? (
              <div className="text-sm text-muted-foreground">Select a crop to see tailored weather advisories.</div>
            ) : (
              <div className="space-y-3">
                {advisories.map((a, i) => (
                  <div key={i} className={`p-4 border-l-4 ${a.tone === 'warn' ? 'bg-yellow-50 border-yellow-500' : 'bg-green-50 border-green-500'}`}>
                    <h4 className={`font-semibold ${a.tone === 'warn' ? 'text-yellow-800' : 'text-green-800'}`}>{a.title}</h4>
                    <p className={a.tone === 'warn' ? 'text-yellow-700' : 'text-green-700'}>{a.body}</p>
              </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CropCalendar;