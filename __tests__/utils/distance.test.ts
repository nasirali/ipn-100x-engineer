import { calculateDistance, formatDistance, mockGeocode } from '@/utils/distance';

describe('Distance Utilities', () => {
  describe('calculateDistance', () => {
    it('calculates distance between two points correctly', () => {
      // San Francisco to Los Angeles is approximately 559 km
      const distance = calculateDistance(37.7749, -122.4194, 34.0522, -118.2437);
      expect(distance).toBeGreaterThan(550);
      expect(distance).toBeLessThan(570);
    });

    it('returns 0 for the same point', () => {
      const distance = calculateDistance(37.7749, -122.4194, 37.7749, -122.4194);
      expect(distance).toBe(0);
    });

    it('calculates short distances accurately', () => {
      // Two points very close together
      const distance = calculateDistance(37.7749, -122.4194, 37.7750, -122.4195);
      expect(distance).toBeLessThan(0.2); // Less than 200 meters
    });

    it('handles crossing the equator', () => {
      const distance = calculateDistance(10, 0, -10, 0);
      expect(distance).toBeGreaterThan(2200); // Approximately 2220 km
      expect(distance).toBeLessThan(2250);
    });

    it('handles crossing the prime meridian', () => {
      const distance = calculateDistance(0, 10, 0, -10);
      expect(distance).toBeGreaterThan(2200); // Approximately 2226 km
      expect(distance).toBeLessThan(2250);
    });

    it('calculates maximum distance (antipodal points)', () => {
      // Opposite sides of Earth
      const distance = calculateDistance(0, 0, 0, 180);
      expect(distance).toBeGreaterThan(20000); // Half Earth's circumference
    });

    it('handles negative coordinates', () => {
      const distance = calculateDistance(-33.8688, 151.2093, -37.8136, 144.9631);
      expect(distance).toBeGreaterThan(700); // Sydney to Melbourne
      expect(distance).toBeLessThan(900);
    });
  });

  describe('formatDistance', () => {
    it('formats distances under 1km in meters', () => {
      expect(formatDistance(0.5)).toBe('500m');
    });

    it('formats distances over 1km in kilometers', () => {
      expect(formatDistance(5.5)).toBe('5.5 km');
    });

    it('formats very small distances', () => {
      expect(formatDistance(0.05)).toBe('50m');
    });

    it('formats exactly 1km', () => {
      expect(formatDistance(1)).toBe('1.0 km');
    });

    it('rounds meters to nearest integer', () => {
      expect(formatDistance(0.567)).toBe('567m');
    });

    it('formats large distances', () => {
      expect(formatDistance(1234.5)).toBe('1234.5 km');
    });

    it('handles zero distance', () => {
      expect(formatDistance(0)).toBe('0m');
    });
  });

  describe('mockGeocode', () => {
    it('returns coordinates for San Francisco', () => {
      const result = mockGeocode('San Francisco');
      expect(result).toEqual({
        latitude: 37.7749,
        longitude: -122.4194,
      });
    });

    it('returns coordinates for case-insensitive San Francisco', () => {
      const result = mockGeocode('san francisco');
      expect(result).toEqual({
        latitude: 37.7749,
        longitude: -122.4194,
      });
    });

    it('returns coordinates for SF abbreviation', () => {
      const result = mockGeocode('SF');
      expect(result).toEqual({
        latitude: 37.7749,
        longitude: -122.4194,
      });
    });

    it('returns coordinates for 94102 zip code', () => {
      const result = mockGeocode('94102');
      expect(result).toEqual({
        latitude: 37.7749,
        longitude: -122.4194,
      });
    });

    it('returns coordinates for Mission District', () => {
      const result = mockGeocode('Mission District');
      expect(result).toEqual({
        latitude: 37.7599,
        longitude: -122.4148,
      });
    });

    it('returns coordinates for Downtown SF', () => {
      const result = mockGeocode('Downtown');
      expect(result).toEqual({
        latitude: 37.7937,
        longitude: -122.3965,
      });
    });

    it('returns default coordinates for unknown locations', () => {
      const result = mockGeocode('Unknown City XYZ');
      expect(result).toEqual({
        latitude: 37.7749,
        longitude: -122.4194,
      });
    });

    it('handles empty string', () => {
      const result = mockGeocode('');
      expect(result).toEqual({
        latitude: 37.7749,
        longitude: -122.4194,
      });
    });

    it('handles whitespace-only input', () => {
      const result = mockGeocode('   ');
      expect(result).toEqual({
        latitude: 37.7749,
        longitude: -122.4194,
      });
    });
  });
});
