export interface GeocodeResult {
  lat: number;
  lon: number;
}

export const geocodeService = {
  async resolve(query: string): Promise<GeocodeResult | null> {
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.lat && data.lon) {
          return { lat: data.lat, lon: data.lon };
        }
      }
      return null;
    } catch (e) {
      console.error("Geocoding failed", e);
      return null;
    }
  },
};
