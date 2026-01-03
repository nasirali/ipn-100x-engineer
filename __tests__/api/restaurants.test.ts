/**
 * API Route Tests for /api/restaurants
 * 
 * These tests verify the restaurants API endpoint functionality
 */

import { GET, POST } from '@/app/api/restaurants/route';
import { NextRequest } from 'next/server';

// Helper to create mock NextRequest
function createMockRequest(url: string, method: string = 'GET'): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost:3000'), {
    method,
  });
}

describe('Restaurants API - GET', () => {
  it('should return restaurants for a valid address', async () => {
    const request = createMockRequest('/api/restaurants?address=San Francisco');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.restaurants).toBeDefined();
    expect(Array.isArray(data.restaurants)).toBe(true);
    expect(data.restaurants.length).toBeGreaterThan(0);
    expect(data.searchLocation).toBeDefined();
  });

  it('should return restaurants for valid coordinates', async () => {
    const request = createMockRequest('/api/restaurants?lat=37.7749&lng=-122.4194');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.restaurants).toBeDefined();
    expect(Array.isArray(data.restaurants)).toBe(true);
  });

  it('should handle coordinate string format from geolocation', async () => {
    const request = createMockRequest('/api/restaurants?address=37.7749,-122.4194');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.restaurants).toBeDefined();
    expect(data.searchLocation.latitude).toBeCloseTo(37.7749, 4);
    expect(data.searchLocation.longitude).toBeCloseTo(-122.4194, 4);
  });

  it('should limit results to 5 restaurants', async () => {
    const request = createMockRequest('/api/restaurants?address=San Francisco');
    const response = await GET(request);
    const data = await response.json();

    expect(data.restaurants.length).toBeLessThanOrEqual(5);
  });

  it('should sort results by distance', async () => {
    const request = createMockRequest('/api/restaurants?address=San Francisco');
    const response = await GET(request);
    const data = await response.json();

    const distances = data.restaurants.map((r: any) => r.distance);
    const sortedDistances = [...distances].sort((a, b) => a - b);
    expect(distances).toEqual(sortedDistances);
  });

  it('should include distance in each restaurant', async () => {
    const request = createMockRequest('/api/restaurants?address=San Francisco');
    const response = await GET(request);
    const data = await response.json();

    data.restaurants.forEach((restaurant: any) => {
      expect(restaurant.distance).toBeDefined();
      expect(typeof restaurant.distance).toBe('number');
      expect(restaurant.distance).toBeGreaterThanOrEqual(0);
    });
  });

  it('should handle invalid coordinates', async () => {
    const request = createMockRequest('/api/restaurants?lat=invalid&lng=invalid');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it('should use default coordinates when no parameters provided', async () => {
    const request = createMockRequest('/api/restaurants');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.restaurants).toBeDefined();
    expect(data.searchLocation.latitude).toBe(37.7749);
    expect(data.searchLocation.longitude).toBe(-122.4194);
  });

  it('should handle unknown addresses with fallback', async () => {
    const request = createMockRequest('/api/restaurants?address=UnknownCity123');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.restaurants).toBeDefined();
  });

  it('should return proper restaurant structure', async () => {
    const request = createMockRequest('/api/restaurants?address=San Francisco');
    const response = await GET(request);
    const data = await response.json();

    const restaurant = data.restaurants[0];
    expect(restaurant).toHaveProperty('id');
    expect(restaurant).toHaveProperty('name');
    expect(restaurant).toHaveProperty('address');
    expect(restaurant).toHaveProperty('cuisine');
    expect(restaurant).toHaveProperty('rating');
    expect(restaurant).toHaveProperty('priceRange');
    expect(restaurant).toHaveProperty('openingHours');
    expect(restaurant).toHaveProperty('closingHours');
    expect(restaurant).toHaveProperty('latitude');
    expect(restaurant).toHaveProperty('longitude');
    expect(restaurant).toHaveProperty('phone');
    expect(restaurant).toHaveProperty('description');
    expect(restaurant).toHaveProperty('distance');
  });
});

describe('Restaurants API - POST', () => {
  it('should return error when latitude is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/restaurants', {
      method: 'POST',
      body: JSON.stringify({ longitude: -122.4194 }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it('should return error when longitude is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/restaurants', {
      method: 'POST',
      body: JSON.stringify({ latitude: 37.7749 }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it('should return restaurants with valid coordinates', async () => {
    const request = new NextRequest('http://localhost:3000/api/restaurants', {
      method: 'POST',
      body: JSON.stringify({
        latitude: 37.7749,
        longitude: -122.4194,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.restaurants).toBeDefined();
    expect(Array.isArray(data.restaurants)).toBe(true);
  });

  it('should filter by cuisine when provided', async () => {
    const request = new NextRequest('http://localhost:3000/api/restaurants', {
      method: 'POST',
      body: JSON.stringify({
        latitude: 37.7749,
        longitude: -122.4194,
        filters: { cuisine: 'Italian' },
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    data.restaurants.forEach((restaurant: any) => {
      expect(restaurant.cuisine).toBe('Italian');
    });
  });

  it('should filter by minimum rating when provided', async () => {
    const request = new NextRequest('http://localhost:3000/api/restaurants', {
      method: 'POST',
      body: JSON.stringify({
        latitude: 37.7749,
        longitude: -122.4194,
        filters: { minRating: 4.0 },
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    data.restaurants.forEach((restaurant: any) => {
      expect(restaurant.rating).toBeGreaterThanOrEqual(4.0);
    });
  });

  it('should filter by price range when provided', async () => {
    const request = new NextRequest('http://localhost:3000/api/restaurants', {
      method: 'POST',
      body: JSON.stringify({
        latitude: 37.7749,
        longitude: -122.4194,
        filters: { priceRange: '$$' },
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    data.restaurants.forEach((restaurant: any) => {
      expect(restaurant.priceRange).toBe('$$');
    });
  });
});
