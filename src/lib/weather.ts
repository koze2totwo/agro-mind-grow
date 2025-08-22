// Utilities for fetching live weather data from Open-Meteo without API keys
// - Geocoding: https://geocoding-api.open-meteo.com/v1/search
// - Forecast:  https://api.open-meteo.com/v1/forecast

export type WeatherCurrent = {
	locationLabel: string;
	temperatureC: number;
	conditionCode: number;
	humidityPercent: number | null;
	windSpeedKmh: number | null;
	visibilityKm: number | null; // Open-Meteo does not provide visibility in standard endpoint; keep null
	uvIndex: number | null; // Not available on standard endpoint; keep null
};

export type WeatherDaily = {
	dayLabel: string;
	highC: number;
	lowC: number;
	conditionCode: number;
	precipitationMm?: number;
};

export type WeatherResult = {
	current: WeatherCurrent;
	forecast: WeatherDaily[]; // next 5 days
};

export async function fetchWeatherByCity(city: string, countryCode?: string): Promise<WeatherResult> {
	const geocodeUrl = new URL('https://geocoding-api.open-meteo.com/v1/search');
	geocodeUrl.searchParams.set('name', city);
	geocodeUrl.searchParams.set('count', '1');
	geocodeUrl.searchParams.set('language', 'en');
	geocodeUrl.searchParams.set('format', 'json');

	const geocodeRes = await fetch(geocodeUrl.toString());
	if (!geocodeRes.ok) throw new Error('Failed to look up location');
	const geocode = await geocodeRes.json();
	const match = (geocode?.results ?? []).find((r: any) =>
		countryCode ? (r.country_code?.toLowerCase() === countryCode.toLowerCase()) : true
	);
	if (!match) throw new Error('Location not found');

	const latitude = match.latitude;
	const longitude = match.longitude;
	const locationLabel = [match.name, match.admin1, match.country].filter(Boolean).join(', ');

	const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast');
	forecastUrl.searchParams.set('latitude', String(latitude));
	forecastUrl.searchParams.set('longitude', String(longitude));
	forecastUrl.searchParams.set('timezone', 'auto');
	forecastUrl.searchParams.set('current', 'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m');
	forecastUrl.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum');

	const forecastRes = await fetch(forecastUrl.toString());
	if (!forecastRes.ok) throw new Error('Failed to fetch weather data');
	const data = await forecastRes.json();

	const current: WeatherCurrent = {
		locationLabel,
		temperatureC: round(data?.current?.temperature_2m),
		conditionCode: data?.current?.weather_code ?? 0,
		humidityPercent: data?.current?.relative_humidity_2m ?? null,
		windSpeedKmh: typeof data?.current?.wind_speed_10m === 'number' ? round(data.current.wind_speed_10m) : null,
		visibilityKm: null,
		uvIndex: null,
	};

	const dates: string[] = data?.daily?.time ?? [];
	const highs: number[] = data?.daily?.temperature_2m_max ?? [];
	const lows: number[] = data?.daily?.temperature_2m_min ?? [];
	const codes: number[] = data?.daily?.weather_code ?? [];
	const precip: number[] = data?.daily?.precipitation_sum ?? [];

	const forecast: WeatherDaily[] = dates.slice(0, 7).map((date, i) => ({
		dayLabel: formatDayLabel(date, i),
		highC: round(highs[i]),
		lowC: round(lows[i]),
		conditionCode: codes[i] ?? 0,
		precipitationMm: typeof precip?.[i] === 'number' ? round(precip[i]) : undefined,
	}));

	return { current, forecast };
}

function round(value: any): number {
	return Math.round(Number(value));
}

function formatDayLabel(dateIso: string, index: number): string {
	try {
		const date = new Date(dateIso);
		const today = new Date();
		const isToday = date.toDateString() === today.toDateString();
		if (index === 0 && isToday) return 'Today';
		const tomorrow = new Date();
		tomorrow.setDate(today.getDate() + 1);
		if (index === 1 && date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
		return date.toLocaleDateString(undefined, { weekday: 'short' });
	} catch {
		return `Day ${index + 1}`;
	}
}

// Simple mapping of Open-Meteo weather codes to display strings
export function codeToCondition(code: number): string {
	// https://open-meteo.com/en/docs#latitude=52.52&longitude=13.41&hourly=weather_code
	if (code === 0) return 'Clear';
	if ([1, 2, 3].includes(code)) return 'Partly Cloudy';
	if ([45, 48].includes(code)) return 'Foggy';
	if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'Rainy';
	if ([56, 57, 66, 67].includes(code)) return 'Freezing Rain';
	if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snowy';
	if ([95, 96, 99].includes(code)) return 'Thunderstorm';
	return 'Cloudy';
}


