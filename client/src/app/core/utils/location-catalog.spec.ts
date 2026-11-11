import { describe, expect, it } from 'vitest';
import { getCatalogMapCenter } from './location-catalog';

describe('getCatalogMapCenter', () => {
  it('returns the Sydney center for the catalog city', () => {
    const center = getCatalogMapCenter('Sydney');
    expect(center?.city).toBe('Sydney');
    expect(center?.lat).toBeCloseTo(-33.8688);
    expect(center?.lng).toBeCloseTo(151.2093);
  });

  it('returns nothing for a city outside the catalogue', () => {
    expect(getCatalogMapCenter('Adelaide')).toBeNull();
  });
});
