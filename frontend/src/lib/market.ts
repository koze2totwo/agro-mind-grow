// Market prices via data.gov.in (Agmarknet) API
// Resource defaults to Agmarknet daily prices dataset.

export type MarketPriceRecord = {
	state: string;
	district: string;
	market: string;
	commodity: string;
	variety?: string;
	arrival_date: string; // YYYY-MM-DD
	min_price?: number;
	max_price?: number;
	modal_price?: number;
	unit_of_price?: string;
};

export type MarketQuery = {
	state?: string;
	commodity?: string;
	// Date filters are flaky via API for some datasets; prefer client-side filtering.
	limit?: number;
	offset?: number;
};

export type MarketApiResponse = {
	updated: string;
	count: number;
	records: MarketPriceRecord[];
};

const DEFAULT_RESOURCE = (import.meta as any).env?.VITE_MARKET_RESOURCE_ID || '9ef84268-d588-465a-a308-a864a43d0070';

export function isMarketApiConfigured(): boolean {
	return Boolean((import.meta as any).env?.VITE_DATA_GOV_API_KEY);
}

export async function fetchMarketPrices(query: MarketQuery): Promise<MarketApiResponse> {
	const apiKey = (import.meta as any).env?.VITE_DATA_GOV_API_KEY;
	if (!apiKey) {
		// Fallback to bundled sample data so the UI remains functional without a key
		const sample = await fetch('/sample-market.json').then((r) => r.json());
		return sample as MarketApiResponse;
	}

	const resource = DEFAULT_RESOURCE;
	const url = new URL(`https://api.data.gov.in/resource/${resource}`);
	url.searchParams.set('api-key', apiKey);
	url.searchParams.set('format', 'json');
	url.searchParams.set('limit', String(query.limit ?? 100));
	if (typeof query.offset === 'number' && query.offset > 0) {
		url.searchParams.set('offset', String(query.offset));
	}

	// Filters per dataset fields
	if (query.state) url.searchParams.set('filters[state]', query.state);
	if (query.commodity) url.searchParams.set('filters[commodity]', query.commodity);
	// Avoid arrival_date filters; fetch recent entries instead and filter client-side

	const res = await fetch(url.toString());
	if (!res.ok) throw new Error('Failed to fetch market prices');

	const json = await res.json();
	const records = (json?.records ?? []).map((r: any) => ({
		state: strOr(r, ['state', 'State']),
		district: strOr(r, ['district', 'District']),
		market: strOr(r, ['market', 'Market']),
		commodity: strOr(r, ['commodity', 'Commodity']),
		variety: strOr(r, ['variety', 'Variety']),
		arrival_date: strOr(r, ['arrival_date', 'Arrival_Date']),
		min_price: numOrUndefined(valOr(r, ['min_price', 'Min_x0020_Price', 'min_x0020_price'])),
		max_price: numOrUndefined(valOr(r, ['max_price', 'Max_x0020_Price', 'max_x0020_price'])),
		modal_price: numOrUndefined(valOr(r, ['modal_price', 'Modal_x0020_Price', 'modal_x0020_price'])),
		unit_of_price: strOr(r, ['price_unit', 'unit_of_price', 'Unit_of_Price']) || 'per quintal',
	})) as MarketPriceRecord[];

	return {
		updated: json?.updated || new Date().toISOString(),
		count: Number(json?.count ?? records.length),
		records,
	};
}

function numOrUndefined(v: any): number | undefined {
	if (v == null) return undefined;
	const n = parseFloat(String(v).replace(/,/g, ''));
	return Number.isFinite(n) ? n : undefined;
}

function valOr(obj: any, keys: string[]): any {
	for (const k of keys) {
		if (obj && Object.prototype.hasOwnProperty.call(obj, k)) return obj[k];
	}
	return undefined;
}

function strOr(obj: any, keys: string[]): string {
	const v = valOr(obj, keys);
	return v == null ? '' : String(v);
}


