// Minimal crop schedule primitives for India. No API key required.

export type Season = 'Kharif' | 'Rabi' | 'Zaid' | 'Annual';

export type CropInfo = {
  name: string;
  season: Season;
  sowingMonths: number[]; // 1-12
  harvestingMonths: number[]; // 1-12
  durationDays: [number, number];
  preferredTemperatureC: [number, number];
  waterNeed: 'Low' | 'Medium' | 'High' | 'Very High';
};

export const CROPS: CropInfo[] = [
  {
    name: 'Rice',
    season: 'Kharif',
    sowingMonths: [6, 7],
    harvestingMonths: [10, 11],
    durationDays: [120, 150],
    preferredTemperatureC: [20, 32],
    waterNeed: 'Very High',
  },
  {
    name: 'Wheat',
    season: 'Rabi',
    sowingMonths: [11, 12],
    harvestingMonths: [3, 4],
    durationDays: [120, 140],
    preferredTemperatureC: [10, 25],
    waterNeed: 'Medium',
  },
  {
    name: 'Maize',
    season: 'Kharif',
    sowingMonths: [6, 7],
    harvestingMonths: [9, 10],
    durationDays: [90, 110],
    preferredTemperatureC: [18, 27],
    waterNeed: 'Medium',
  },
  {
    name: 'Cotton',
    season: 'Kharif',
    sowingMonths: [5, 6],
    harvestingMonths: [11, 1], // Nov-Jan
    durationDays: [150, 180],
    preferredTemperatureC: [20, 35],
    waterNeed: 'Medium',
  },
  {
    name: 'Soyabean',
    season: 'Kharif',
    sowingMonths: [6, 7],
    harvestingMonths: [9, 10],
    durationDays: [90, 110],
    preferredTemperatureC: [15, 30],
    waterNeed: 'Medium',
  },
  {
    name: 'Mustard',
    season: 'Rabi',
    sowingMonths: [10, 11],
    harvestingMonths: [2, 3],
    durationDays: [110, 130],
    preferredTemperatureC: [10, 25],
    waterNeed: 'Low',
  },
  {
    name: 'Gram',
    season: 'Rabi',
    sowingMonths: [10, 11],
    harvestingMonths: [2, 3],
    durationDays: [110, 130],
    preferredTemperatureC: [10, 25],
    waterNeed: 'Low',
  },
];

export function getCropByName(name: string | undefined): CropInfo | undefined {
  if (!name) return undefined;
  const norm = name.trim().toLowerCase();
  return CROPS.find((c) => c.name.toLowerCase() === norm);
}

export function monthName(m: number): string {
  return new Date(2000, m - 1, 1).toLocaleString(undefined, { month: 'short' });
}

export type Stage = 'Sowing' | 'Growing' | 'Harvest' | 'Off-season';

export function getStageForMonth(crop: CropInfo, month: number): Stage {
  if (crop.sowingMonths.includes(month)) return 'Sowing';
  if (crop.harvestingMonths.includes(month)) return 'Harvest';
  // Approximate: between sowing and harvest months is growing
  const sMin = Math.min(...crop.sowingMonths);
  const sMax = Math.max(...crop.sowingMonths);
  const hMin = Math.min(...crop.harvestingMonths);
  const hMax = Math.max(...crop.harvestingMonths);
  if (sMax < hMin && month > sMax && month < hMin) return 'Growing';
  if (sMin > hMax && (month > sMax || month < hMin)) return 'Growing';
  return 'Off-season';
}

export type Readiness = {
  sowingRecommended: boolean;
  reasons: string[];
};

// Basic heuristic: recommend sowing if current month in sowing window and forecast has rain or temp within range
export function evaluateSowingReadiness(
  crop: CropInfo,
  opts: { next7DayAvgTempC?: number; next7DayTotalRainMm?: number; currentMonth: number }
): Readiness {
  const reasons: string[] = [];
  let ok = false;
  const inWindow = crop.sowingMonths.includes(opts.currentMonth);
  if (inWindow) {
    ok = true;
    reasons.push('Within sowing window');
  } else {
    reasons.push('Outside typical sowing window');
  }
  if (typeof opts.next7DayAvgTempC === 'number') {
    const [tMin, tMax] = crop.preferredTemperatureC;
    const tOk = opts.next7DayAvgTempC >= tMin && opts.next7DayAvgTempC <= tMax;
    ok = ok && tOk;
    reasons.push(`Avg temp ${Math.round(opts.next7DayAvgTempC)}°C (ideal ${tMin}-${tMax}°C)`);
  }
  if (typeof opts.next7DayTotalRainMm === 'number') {
    const rain = opts.next7DayTotalRainMm;
    const rainOk = crop.waterNeed === 'Very High' ? rain >= 30 : crop.waterNeed === 'High' ? rain >= 20 : crop.waterNeed === 'Medium' ? rain >= 10 : rain >= 0;
    ok = ok && rainOk;
    reasons.push(`Next 7-day rain ${Math.round(rain)} mm`);
  }
  return { sowingRecommended: ok, reasons };
}


