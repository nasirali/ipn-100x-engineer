'use client';

import { useState, FormEvent } from 'react';

interface SearchFormProps {
  onSearch: (location: string) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [location, setLocation] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      onSearch(location.trim());
    }
  };

  const handleUseMyLocation = () => {
    setGettingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Use coordinates directly by setting them as the location
        setLocation(`${latitude},${longitude}`);
        setGettingLocation(false);
        // Automatically trigger search with coordinates
        onSearch(`${latitude},${longitude}`);
      },
      (error) => {
        let errorMessage = 'Unable to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        setLocationError(errorMessage);
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Enter your location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter address, city, or zip code..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
            disabled={isLoading || gettingLocation}
          />
        </div>
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={isLoading || gettingLocation}
            className="px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            title="Use my current location"
          >
            {gettingLocation ? (
              <>
                <span className="animate-spin">⌛</span>
                <span className="hidden sm:inline">Getting...</span>
              </>
            ) : (
              <>
                <span>📍</span>
                <span className="hidden sm:inline">My Location</span>
              </>
            )}
          </button>
          <button
            type="submit"
            disabled={isLoading || !location.trim() || gettingLocation}
            className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? 'Searching...' : 'Find Restaurants'}
          </button>
        </div>
      </div>
      {locationError && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{locationError}</p>
        </div>
      )}
      <p className="mt-3 text-sm text-gray-500">
        💡 Tip: Try searching for &quot;San Francisco&quot;, &quot;Downtown&quot;, or a zip code like &quot;94102&quot;
      </p>
    </form>
  );
}
