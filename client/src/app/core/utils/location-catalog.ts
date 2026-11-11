export const CATALOG_LOCATIONS = ['Sydney', 'Melbourne', 'Brisbane', 'Perth'] as const;

export type CatalogLocation = (typeof CATALOG_LOCATIONS)[number];

export type CatalogMapCenter = {
  lat: number;
  lng: number;
  zoom: number;
};

/** Approximate city centers for the vehicle detail map. */
export const CATALOG_MAP_CENTERS: Record<CatalogLocation, CatalogMapCenter> = {
  Sydney: { lat: -33.8688, lng: 151.2093, zoom: 11 },
  Melbourne: { lat: -37.8136, lng: 144.9631, zoom: 11 },
  Brisbane: { lat: -27.4698, lng: 153.0251, zoom: 11 },
  Perth: { lat: -31.9505, lng: 115.8605, zoom: 11 },
};

export function getCatalogMapCenter(location: string): (CatalogMapCenter & { city: CatalogLocation }) | null {
  const city = normalizeCatalogLocation(location);
  if (!city) {
    return null;
  }
  return { city, ...CATALOG_MAP_CENTERS[city] };
}

const STATE_TO_CATALOG: Record<string, CatalogLocation> = {
  NSW: 'Sydney',
  'NEW SOUTH WALES': 'Sydney',
  VIC: 'Melbourne',
  VICTORIA: 'Melbourne',
  QLD: 'Brisbane',
  QUEENSLAND: 'Brisbane',
  WA: 'Perth',
  'WESTERN AUSTRALIA': 'Perth',
};

export function normalizeCatalogLocation(value: string): CatalogLocation | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  return CATALOG_LOCATIONS.find((c) => c.toLowerCase() === trimmed.toLowerCase()) ?? null;
}

export function extractCatalogLocationFromDisplayText(text: string): CatalogLocation | null {
  const trimmed = text.trim();
  if (!trimmed) {
    return null;
  }

  const exact = normalizeCatalogLocation(trimmed);
  if (exact) {
    return exact;
  }

  const firstSegment = trimmed.split(',')[0]?.trim();
  if (firstSegment) {
    const fromFirst = normalizeCatalogLocation(firstSegment);
    if (fromFirst) {
      return fromFirst;
    }
  }

  for (const catalog of CATALOG_LOCATIONS) {
    const pattern = new RegExp(`^${catalog}\\b`, 'i');
    if (pattern.test(trimmed)) {
      return catalog;
    }
  }

  const lower = trimmed.toLowerCase();
  for (const [state, catalog] of Object.entries(STATE_TO_CATALOG)) {
    if (lower.includes(state.toLowerCase())) {
      return catalog;
    }
  }

  return null;
}
