export interface CountryPricingDetail {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  prices: Record<string, number>;
}

export const PRICING_COUNTRIES: CountryPricingDetail[] = [
  {
    code: "CA",
    name: "Canada",
    currency: "CAD",
    currencySymbol: "C$",
    prices: {
      STARTER: 99,
      GROWTH: 150, // $150 CAD requested by client
      PRO: 299,
      ENTERPRISE: 499,
    },
  },
  {
    code: "US",
    name: "United States",
    currency: "USD",
    currencySymbol: "$",
    prices: {
      STARTER: 79,
      GROWTH: 149,
      PRO: 299,
      ENTERPRISE: 499,
    },
  },
  {
    code: "GB",
    name: "United Kingdom",
    currency: "GBP",
    currencySymbol: "£",
    prices: {
      STARTER: 79,
      GROWTH: 149,
      PRO: 299,
      ENTERPRISE: 499,
    },
  },
  {
    code: "AU",
    name: "Australia",
    currency: "AUD",
    currencySymbol: "A$",
    prices: {
      STARTER: 99,
      GROWTH: 199,
      PRO: 399,
      ENTERPRISE: 599,
    },
  },
  {
    code: "NL",
    name: "Europe",
    currency: "EUR",
    currencySymbol: "€",
    prices: {
      STARTER: 79,
      GROWTH: 149,
      PRO: 299,
      ENTERPRISE: 499,
    },
  },
];

export const COUNTRY_CACHE_KEY = "gmr_pricing_country";

/**
 * Synchronous instant location detection from browser environment
 */
export function detectUserCountrySync(profileCountry?: string): string {
  if (profileCountry) {
    const p = profileCountry.toLowerCase();
    if (p.includes("canada") || p === "ca") return "CA";
    if (p.includes("united kingdom") || p === "gb" || p === "uk") return "GB";
    if (p.includes("australia") || p === "au") return "AU";
    if (p.includes("ireland") || p.includes("netherlands") || p.includes("germany") || p.includes("france")) return "NL";
    if (p.includes("united states") || p === "us" || p === "usa") return "US";
  }

  if (typeof window === "undefined") return "CA";

  try {
    const saved = localStorage.getItem(COUNTRY_CACHE_KEY);
    if (saved && PRICING_COUNTRIES.some((c) => c.code === saved)) {
      return saved;
    }

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const lang = navigator.language || "";

    if (
      tz.includes("Toronto") ||
      tz.includes("Vancouver") ||
      tz.includes("Edmonton") ||
      tz.includes("Winnipeg") ||
      tz.includes("Halifax") ||
      tz.includes("Montreal") ||
      tz.includes("Canada") ||
      lang.toLowerCase().includes("-ca")
    ) {
      return "CA";
    }

    if (tz.includes("London") || lang.toLowerCase().includes("-gb")) {
      return "GB";
    }

    if (tz.includes("Sydney") || tz.includes("Melbourne") || lang.toLowerCase().includes("-au")) {
      return "AU";
    }

    if (
      tz.includes("Amsterdam") ||
      tz.includes("Berlin") ||
      tz.includes("Paris") ||
      tz.includes("Rome") ||
      tz.includes("Madrid") ||
      tz.includes("Dublin") ||
      lang.toLowerCase().includes("-nl") ||
      lang.toLowerCase().includes("-de") ||
      lang.toLowerCase().includes("-fr")
    ) {
      return "NL";
    }
  } catch {}

  return "CA"; // Default to Canada
}

/**
 * Asynchronous precise IP geolocation detection
 */
export async function detectUserCountryAsync(profileCountry?: string): Promise<string> {
  const sync = detectUserCountrySync(profileCountry);
  if (typeof window === "undefined") return sync;

  try {
    const res = await fetch("https://api.country.is");
    if (!res.ok) return sync;
    const data = await res.json();
    const code = (data?.country || "").toUpperCase();

    if (code === "CA") return "CA";
    if (code === "US") return "US";
    if (code === "GB") return "GB";
    if (code === "AU") return "AU";
    if (["NL", "DE", "FR", "ES", "IT", "IE", "BE", "AT", "PT", "FI"].includes(code)) return "NL";

    return code && PRICING_COUNTRIES.some((c) => c.code === code) ? code : sync;
  } catch {
    return sync;
  }
}

/**
 * Get country pricing configuration
 */
export function getCountryDetail(countryCode: string): CountryPricingDetail {
  const found = PRICING_COUNTRIES.find((c) => c.code === countryCode);
  return found || PRICING_COUNTRIES[0]; // fallback to Canada
}

/**
 * Get accurate price and currency for a plan in a specific country
 */
export function getPlanPricing(
  planKey: string,
  countryCode: string,
  fallbackPrice?: number
): {
  price: number;
  currency: string;
  currencySymbol: string;
  formatted: string;
} {
  const country = getCountryDetail(countryCode);
  const normalizedKey = (planKey || "").toUpperCase();

  let price = country.prices[normalizedKey];
  if (price === undefined) {
    price = fallbackPrice ?? 149;
  }

  return {
    price,
    currency: country.currency,
    currencySymbol: country.currencySymbol,
    formatted: `${country.currencySymbol}${price}`,
  };
}
