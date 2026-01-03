'use client';

import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Restaurant } from '@/types/restaurant';

interface MapViewProps {
    restaurants: Restaurant[];
    center: { lat: number; lng: number };
}

const mapContainerStyle = {
    width: '100%',
    height: '600px',
};

const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
};

export default function MapView({ restaurants, center }: MapViewProps) {
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [mapCenter, setMapCenter] = useState(center);
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

    useEffect(() => {
        setMapCenter(center);
    }, [center]);

    if (!apiKey) {
        return (
            <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center p-6">
                    <p className="text-lg font-medium text-gray-700 mb-2">Google Maps API Key Required</p>
                    <p className="text-sm text-gray-500">
                        Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg overflow-hidden shadow-lg">
            <LoadScript googleMapsApiKey={apiKey}>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={mapCenter}
                    zoom={13}
                    options={mapOptions}
                >
                    {/* User location marker */}
                    <Marker
                        position={mapCenter}
                        icon={{
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: '#3B82F6',
                            fillOpacity: 1,
                            strokeColor: '#FFFFFF',
                            strokeWeight: 2,
                        }}
                        title="Your Location"
                    />

                    {/* Restaurant markers */}
                    {restaurants.map((restaurant) => (
                        <Marker
                            key={restaurant.id}
                            position={{
                                lat: restaurant.latitude,
                                lng: restaurant.longitude,
                            }}
                            onClick={() => setSelectedRestaurant(restaurant)}
                            icon={{
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 10,
                                fillColor: '#EF4444',
                                fillOpacity: 1,
                                strokeColor: '#FFFFFF',
                                strokeWeight: 2,
                            }}
                            title={restaurant.name}
                        />
                    ))}

                    {/* Info Window */}
                    {selectedRestaurant && (
                        <InfoWindow
                            position={{
                                lat: selectedRestaurant.latitude,
                                lng: selectedRestaurant.longitude,
                            }}
                            onCloseClick={() => setSelectedRestaurant(null)}
                        >
                            <div className="p-2 max-w-xs">
                                <h3 className="font-semibold text-lg mb-1">{selectedRestaurant.name}</h3>
                                <p className="text-sm text-gray-600 mb-1">{selectedRestaurant.cuisine}</p>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-yellow-500">★</span>
                                    <span className="text-sm">{selectedRestaurant.rating.toFixed(1)}</span>
                                    <span className="text-sm text-gray-500">{selectedRestaurant.priceRange}</span>
                                </div>
                                <p className="text-xs text-gray-500 mb-2">{selectedRestaurant.address}</p>
                                {selectedRestaurant.distance !== undefined && (
                                    <p className="text-xs font-medium text-blue-600">
                                        {selectedRestaurant.distance.toFixed(1)} miles away
                                    </p>
                                )}
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}
