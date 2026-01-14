"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, Loader2 } from "lucide-react";

// Set Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

// Jordan boundaries (approximate bounding box)
const JORDAN_BOUNDS: [[number, number], [number, number]] = [
  [34.9, 29.1], // Southwest: [lng, lat]
  [39.3, 33.4], // Northeast: [lng, lat]
];

// UAE boundaries (approximate bounding box)
const UAE_BOUNDS: [[number, number], [number, number]] = [
  [51.5, 22.6], // Southwest: [lng, lat]
  [56.4, 26.1], // Northeast: [lng, lat]
];

// Combined bounds for Jordan and UAE (used for map max bounds)
const COMBINED_BOUNDS: [[number, number], [number, number]] = [
  [34.9, 22.6], // Southwest: min lng, min lat
  [56.4, 33.4], // Northeast: max lng, max lat
];

// Jordan center (Amman)
const JORDAN_CENTER: [number, number] = [35.9106, 31.9539];

// UAE center (Dubai)
const UAE_CENTER: [number, number] = [55.2708, 25.2048];

// Check if coordinates are within Jordan
const isWithinJordan = (lng: number, lat: number): boolean => {
  return (
    lng >= JORDAN_BOUNDS[0][0] &&
    lng <= JORDAN_BOUNDS[1][0] &&
    lat >= JORDAN_BOUNDS[0][1] &&
    lat <= JORDAN_BOUNDS[1][1]
  );
};

// Check if coordinates are within UAE
const isWithinUAE = (lng: number, lat: number): boolean => {
  return (
    lng >= UAE_BOUNDS[0][0] &&
    lng <= UAE_BOUNDS[1][0] &&
    lat >= UAE_BOUNDS[0][1] &&
    lat <= UAE_BOUNDS[1][1]
  );
};

// Check if coordinates are within allowed regions (Jordan or UAE)
const isWithinAllowedRegions = (lng: number, lat: number): boolean => {
  return isWithinJordan(lng, lat) || isWithinUAE(lng, lat);
};

// Get country name from coordinates
const getCountryFromCoordinates = (lng: number, lat: number): string => {
  if (isWithinJordan(lng, lat)) return "Jordan";
  if (isWithinUAE(lng, lat)) return "UAE";
  return "Unknown";
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
  initialLongitude,
  initialLatitude,
  className = "",
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeocodingFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  // Determine initial center
  const initialCenter: [number, number] = 
    initialLongitude !== undefined && initialLatitude !== undefined && 
    isWithinAllowedRegions(initialLongitude, initialLatitude)
      ? [initialLongitude, initialLatitude]
      : JORDAN_CENTER;

  // Reverse geocode to get address from coordinates
  const reverseGeocode = useCallback(
    async (lng: number, lat: number) => {
      // Check if within allowed regions first
      if (!isWithinAllowedRegions(lng, lat)) {
        setLocationError("Please select a location within Jordan or UAE");
        return;
      }
      setLocationError(null);

      // Determine country code for API call
      const countryCode = isWithinJordan(lng, lat) ? "JO" : "AE";
      const defaultCountry = getCountryFromCoordinates(lng, lat);

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}&types=address,place&country=${countryCode}`
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
          let country = defaultCountry;
          let postalCode = "";

          context.forEach((item) => {
            if (item.id.startsWith("place")) {
              city = item.text;
            } else if (item.id.startsWith("region")) {
              state = item.text;
            } else if (item.id.startsWith("country")) {
              // Map country names to our enum values
              const countryText = item.text;
              if (countryText === "Jordan") country = "Jordan";
              else if (countryText === "United Arab Emirates" || countryText === "UAE") country = "UAE";
              else country = countryText;
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
            country: defaultCountry,
          });
        }
      } catch (error) {
        console.error("Reverse geocoding error:", error);
        onLocationChange({
          longitude: lng,
          latitude: lat,
          country: defaultCountry,
        });
      }
    },
    [onLocationChange]
  );

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;

        // Check if within allowed regions (Jordan or UAE)
        if (!isWithinAllowedRegions(longitude, latitude)) {
          setLocationError(
            "Your current location is outside Jordan and UAE. Please select a location within these regions."
          );
          setIsGettingLocation(false);
          return;
        }

        // Move map and marker to user's location
        map.current?.flyTo({
          center: [longitude, latitude],
          zoom: 15,
        });
        marker.current?.setLngLat([longitude, latitude]);

        // Reverse geocode to get address
        reverseGeocode(longitude, latitude);
        setIsGettingLocation(false);
      },
      (error) => {
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(
              "Location permission denied. Please enable location access in your browser settings."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out. Please try again.");
            break;
          default:
            setLocationError("An unknown error occurred while getting your location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [reverseGeocode]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      // Using streets-v12 for better 3D building support
      style: "mapbox://styles/mapbox/streets-v12",
      center: initialCenter,
      zoom: initialLongitude !== undefined && initialLatitude !== undefined ? 16 : 5,
      maxBounds: COMBINED_BOUNDS, // Restrict panning to Jordan and UAE
      // 3D Camera Settings: pitch tilts the camera for 3D perspective view
      pitch: 45,
      // bearing rotates the map for a more dynamic 3D view
      bearing: -17.6,
      // Enable anti-aliasing for smoother 3D rendering
      antialias: true,
    });

    // Add 3D terrain and buildings once the map style is loaded
    map.current.on("style.load", () => {
      if (!map.current) return;

      // Add Mapbox DEM source for real terrain elevation
      // This enables actual elevation data from Mapbox's terrain tiles
      map.current.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        // maxzoom determines the maximum detail level for terrain
        maxzoom: 14,
      });

      // Enable 3D terrain rendering with exaggeration factor
      // exaggeration: 1.5 makes hills/mountains 1.5x taller for visual effect
      map.current.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

      // Add 3D buildings layer using fill-extrusion
      // This renders buildings with height based on their real data
      const layers = map.current.getStyle().layers;
      // Find the first symbol layer to insert buildings below labels
      const labelLayerId = layers?.find(
        (layer) => layer.type === "symbol" && layer.layout?.["text-field"]
      )?.id;

      map.current.addLayer(
        {
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15, // Only show 3D buildings when zoomed in
          paint: {
            // Building color with slight transparency
            "fill-extrusion-color": "#aaa",
            // Building height from data, with smooth transition
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "height"],
            ],
            // Base height for buildings (ground level)
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "min_height"],
            ],
            // Opacity for see-through effect
            "fill-extrusion-opacity": 0.6,
          },
        },
        // Insert below labels for better visibility
        labelLayerId
      );
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Create draggable marker
    marker.current = new mapboxgl.Marker({
      draggable: true,
      color: "#3b82f6",
    })
      .setLngLat(initialCenter)
      .addTo(map.current);

    // Handle marker drag end
    marker.current.on("dragend", () => {
      const lngLat = marker.current?.getLngLat();
      if (lngLat) {
        if (isWithinAllowedRegions(lngLat.lng, lngLat.lat)) {
          setLocationError(null);
          reverseGeocode(lngLat.lng, lngLat.lat);
        } else {
          setLocationError("Please select a location within Jordan or UAE");
          // Reset marker to center of Jordan
          marker.current?.setLngLat(JORDAN_CENTER);
        }
      }
    });

    // Handle map click to move marker
    map.current.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      if (isWithinAllowedRegions(lng, lat)) {
        setLocationError(null);
        marker.current?.setLngLat([lng, lat]);
        reverseGeocode(lng, lat);
      } else {
        setLocationError("Please select a location within Jordan or UAE");
      }
    });

    // Initial reverse geocode
    reverseGeocode(initialCenter[0], initialCenter[1]);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [reverseGeocode, initialCenter, initialLongitude, initialLatitude]);

  // Forward geocoding for search (restricted to Jordan and UAE)
  const searchAddress = useCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Search in both Jordan (JO) and UAE (AE)
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${mapboxgl.accessToken}&types=address,place,locality&limit=5&country=JO,AE`
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

    // Validate location is within allowed regions (Jordan or UAE)
    if (!isWithinAllowedRegions(lng, lat)) {
      setLocationError("Please select a location within Jordan or UAE");
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
    let country = getCountryFromCoordinates(lng, lat);
    let postalCode = "";

    context.forEach((item) => {
      if (item.id.startsWith("place")) {
        city = item.text;
      } else if (item.id.startsWith("region")) {
        state = item.text;
      } else if (item.id.startsWith("country")) {
        // Map country names to our enum values
        const countryText = item.text;
        if (countryText === "Jordan") country = "Jordan";
        else if (countryText === "United Arab Emirates" || countryText === "UAE") country = "UAE";
        else country = countryText;
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
      {/* Search Input and Current Location Button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
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

        {/* Use My Location Button */}
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          title="Use my current location"
        >
          {isGettingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">My Location</span>
        </button>
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
        set the property location. You can also search for an address or use your current location.
      </p>
    </div>
  );
};

export default CustomMapPicker;
