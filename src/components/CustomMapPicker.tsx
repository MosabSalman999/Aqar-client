"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Set Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

// Jordan boundaries (approximate bounding box)
const JORDAN_BOUNDS: [[number, number], [number, number]] = [
  [34.9, 29.1], // Southwest: [lng, lat]
  [39.3, 33.4], // Northeast: [lng, lat]
];

// Jordan center (Amman)
const JORDAN_CENTER: [number, number] = [35.9106, 31.9539];

// Check if coordinates are within Jordan
const isWithinJordan = (lng: number, lat: number): boolean => {
  return (
    lng >= JORDAN_BOUNDS[0][0] &&
    lng <= JORDAN_BOUNDS[1][0] &&
    lat >= JORDAN_BOUNDS[0][1] &&
    lat <= JORDAN_BOUNDS[1][1]
  );
};

interface MapPickerProps {
  initialLongitude?: number;
  initialLatitude?: number;
  onLocationChange: (location: {
    longitude: number;
    latitude: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  }) => void;
  className?: string;
}

interface GeocodingFeature {
  place_name: string;
  center: [number, number];
  context?: Array<{
    id: string;
    text: string;
    short_code?: string;
  }>;
  properties?: {
    address?: string;
  };
  address?: string;
  text?: string;
}

const CustomMapPicker: React.FC<MapPickerProps> = ({
  onLocationChange,
  className = "",
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeocodingFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Reverse geocode to get address from coordinates
  const reverseGeocode = useCallback(
    async (lng: number, lat: number) => {
      // Check if within Jordan first
      if (!isWithinJordan(lng, lat)) {
        setLocationError("Please select a location within Jordan");
        return;
      }
      setLocationError(null);

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}&types=address,place&country=JO`
        );
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const feature = data.features[0] as GeocodingFeature;
          const context = feature.context || [];

          // Extract address components from context
          const address = feature.address
            ? `${feature.address} ${feature.text}`
            : feature.text || "";
          let city = "";
          let state = "";
          let country = "Jordan";
          let postalCode = "";

          context.forEach((item) => {
            if (item.id.startsWith("place")) {
              city = item.text;
            } else if (item.id.startsWith("region")) {
              state = item.text;
            } else if (item.id.startsWith("country")) {
              country = item.text;
            } else if (item.id.startsWith("postcode")) {
              postalCode = item.text;
            }
          });

          onLocationChange({
            longitude: lng,
            latitude: lat,
            address,
            city,
            state,
            country,
            postalCode,
          });
        } else {
          onLocationChange({
            longitude: lng,
            latitude: lat,
            country: "Jordan",
          });
        }
      } catch (error) {
        console.error("Reverse geocoding error:", error);
        onLocationChange({
          longitude: lng,
          latitude: lat,
          country: "Jordan",
        });
      }
    },
    [onLocationChange]
  );

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: JORDAN_CENTER,
      zoom: 8,
      maxBounds: JORDAN_BOUNDS, // Restrict panning to Jordan
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Create draggable marker
    marker.current = new mapboxgl.Marker({
      draggable: true,
      color: "#3b82f6",
    })
      .setLngLat(JORDAN_CENTER)
      .addTo(map.current);

    // Handle marker drag end
    marker.current.on("dragend", () => {
      const lngLat = marker.current?.getLngLat();
      if (lngLat) {
        if (isWithinJordan(lngLat.lng, lngLat.lat)) {
          setLocationError(null);
          reverseGeocode(lngLat.lng, lngLat.lat);
        } else {
          setLocationError("Please select a location within Jordan");
          // Reset marker to center of Jordan
          marker.current?.setLngLat(JORDAN_CENTER);
        }
      }
    });

    // Handle map click to move marker
    map.current.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      if (isWithinJordan(lng, lat)) {
        setLocationError(null);
        marker.current?.setLngLat([lng, lat]);
        reverseGeocode(lng, lat);
      } else {
        setLocationError("Please select a location within Jordan");
      }
    });

    // Initial reverse geocode
    reverseGeocode(JORDAN_CENTER[0], JORDAN_CENTER[1]);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [reverseGeocode]);

  // Forward geocoding for search (restricted to Jordan)
  const searchAddress = useCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${mapboxgl.accessToken}&types=address,place,locality&limit=5&country=JO&bbox=${JORDAN_BOUNDS[0][0]},${JORDAN_BOUNDS[0][1]},${JORDAN_BOUNDS[1][0]},${JORDAN_BOUNDS[1][1]}`
      );
      const data = await response.json();
      setSuggestions(data.features || []);
    } catch (error) {
      console.error("Geocoding error:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchAddress(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchAddress]);

  // Handle suggestion selection
  const handleSelectSuggestion = (feature: GeocodingFeature) => {
    const [lng, lat] = feature.center;

    // Validate location is within Jordan
    if (!isWithinJordan(lng, lat)) {
      setLocationError("Please select a location within Jordan");
      return;
    }
    setLocationError(null);

    // Move map and marker
    map.current?.flyTo({
      center: [lng, lat],
      zoom: 15,
    });
    marker.current?.setLngLat([lng, lat]);

    // Extract address components
    const context = feature.context || [];
    const address = feature.address
      ? `${feature.address} ${feature.text}`
      : feature.text || "";
    let city = "";
    let state = "";
    let country = "Jordan";
    let postalCode = "";

    context.forEach((item) => {
      if (item.id.startsWith("place")) {
        city = item.text;
      } else if (item.id.startsWith("region")) {
        state = item.text;
      } else if (item.id.startsWith("country")) {
        country = item.text;
      } else if (item.id.startsWith("postcode")) {
        postalCode = item.text;
      }
    });

    onLocationChange({
      longitude: lng,
      latitude: lat,
      address,
      city,
      state,
      country,
      postalCode,
    });

    setSearchQuery(feature.place_name);
    setSuggestions([]);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for an address..."
          className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((feature, index) => (
              <li
                key={index}
                onClick={() => handleSelectSuggestion(feature)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {feature.place_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Error Message */}
      {locationError && (
        <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{locationError}</p>
        </div>
      )}

      {/* Map Container */}
      <div
        ref={mapContainer}
        className="w-full h-[300px] rounded-lg border border-gray-200 overflow-hidden"
      />

      {/* Instructions */}
      <p className="text-xs text-gray-500">
        Select a location within Jordan. Click on the map or drag the marker to
        set the property location. You can also search for an address above.
      </p>
    </div>
  );
};

export default CustomMapPicker;
