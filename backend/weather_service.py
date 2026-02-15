import httpx
import asyncio
from typing import Optional, Dict, Any

class WeatherService:
    def __init__(self):
        self.geocoding_url = "https://geocoding-api.open-meteo.com/v1/search"
        self.weather_url = "https://api.open-meteo.com/v1/forecast"

    async def get_coordinates(self, city_name: str) -> Optional[Dict[str, float]]:
        """
        Fetch latitude and longitude for a given city name.
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    self.geocoding_url,
                    params={"name": city_name, "count": 1, "language": "en", "format": "json"}
                )
                data = response.json()
                
                if "results" in data and len(data["results"]) > 0:
                    result = data["results"][0]
                    print(f"📍 Geocoding found: {result['name']}, {result.get('country')} ({result['latitude']}, {result['longitude']})")
                    return {
                        "lat": result["latitude"],
                        "lon": result["longitude"],
                        "name": result["name"],
                        "country": result.get("country", "")
                    }
                
                # Fallback: If "London, UK" fails, try just "London"
                if "," in city_name:
                    simple_city = city_name.split(",")[0].strip()
                    print(f"⚠️ Retrying geocoding for simplified name: '{simple_city}'")
                    response = await client.get(
                        self.geocoding_url,
                        params={"name": simple_city, "count": 1, "language": "en", "format": "json"}
                    )
                    data = response.json()
                    if "results" in data and len(data["results"]) > 0:
                        result = data["results"][0]
                        print(f"📍 Geocoding found (fallback): {result['name']}, {result.get('country')}")
                        return {
                            "lat": result["latitude"],
                            "lon": result["longitude"],
                            "name": result["name"],
                            "country": result.get("country", "")
                        }
                
                return None
        except Exception as e:
            print(f"Error fetching coordinates for {city_name}: {e}")
            return None

    async def get_weather(self, lat: float, lon: float) -> Optional[Dict[str, float]]:
        """
        Fetch current weather (temp, humidity, rain) for given coordinates.
        Note: Open-Meteo 'current' weather doesn't always have rainfall, so we check forecast too.
        """
        try:
            async with httpx.AsyncClient() as client:
                # specific parameters for agriculture relevance
                # specific parameters for agriculture relevance
                # 7-Day Window: 3 days past + Today + 3 days future
                params = {
                    "latitude": lat,
                    "longitude": lon,
                    "daily": ["temperature_2m_max", "temperature_2m_min", "precipitation_sum"], 
                    "hourly": ["relative_humidity_2m"], 
                    "timezone": "auto",
                    "past_days": 3,
                    "forecast_days": 4 # 1 (Today) + 3 (Future)
                }
                
                response = await client.get(self.weather_url, params=params)
                data = response.json()

                if "daily" in data:
                    daily = data["daily"]
                    
                    # Calculate 7-Day Averages
                    
                    # 1. Temperature: Average of (Max + Min) / 2 for each day, then average of range
                    max_temps = daily.get("temperature_2m_max", [])
                    min_temps = daily.get("temperature_2m_min", [])
                    
                    avg_temps = []
                    for tmax, tmin in zip(max_temps, min_temps):
                        if tmax is not None and tmin is not None:
                            avg_temps.append((tmax + tmin) / 2)
                    
                    final_temp = sum(avg_temps) / len(avg_temps) if avg_temps else 25.0
                    
                    # 2. Rainfall: Average Daily Rainfall over the 7 days
                    # Note: Model might expect seasonal total, but average daily * 120 days is a good proxy expectation
                    daily_rains = daily.get("precipitation_sum", [])
                    clean_rains = [r for r in daily_rains if r is not None]
                    avg_daily_rain = sum(clean_rains) / len(clean_rains) if clean_rains else 0.0
                    
                    # Scale to "Seasonal" expectation for the model (approx 4 month season)
                    # if user wants "Seasonal" input, passing avg daily might be too low (e.g. 5mm vs 600mm).
                    # But user asked for "Average Weather Conditions". 
                    # Let's pass the raw average or a seasonal projection? 
                    # The prompt implies "Average weather conditions can be much better". 
                    # Let's pass the SEASONAL PROJECTION (Avg Daily * 30 days * 4 months approx?) 
                    # actually, let's keep it simple: Pass the Average Daily Rain * 100 days roughly?
                    # Or just return the "Average Rain" and let the user understand.
                    # Given the "0mm" complaint, projecting to a season seems safer for the model.
                    # Let's project 120 days (approx crop duration).
                    seasonal_rain_projection = avg_daily_rain * 100 
                    
                    # 3. Humidity: Open-Meteo gives hourly. We average ALL hourly data points returned.
                    hourly_hum = data.get("hourly", {}).get("relative_humidity_2m", [])
                    clean_hum = [h for h in hourly_hum if h is not None]
                    avg_humidity = sum(clean_hum) / len(clean_hum) if clean_hum else 50.0

                    return {
                        "temperature": round(final_temp, 1),
                        "humidity": round(avg_humidity, 1),
                        "rainfall": round(seasonal_rain_projection, 1) 
                    }
                return None
        except Exception as e:
            print(f"Error fetching weather for {lat}, {lon}: {e}")
            return None

    async def get_weather_for_city(self, city_name: str):
        """
        Wrapper to get weather directly from city name.
        """
        coords = await self.get_coordinates(city_name)
        if not coords:
            return {"error": f"City '{city_name}' not found."}
        
        weather = await self.get_weather(coords["lat"], coords["lon"])
        if not weather:
            return {"error": "Could not fetch weather data."}
            
        return {
            "location": f"{coords['name']}, {coords['country']}",
            "data": weather
        }

# Global Instance
weather_service = WeatherService()
