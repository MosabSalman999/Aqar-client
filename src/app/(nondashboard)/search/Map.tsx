"use client";
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppSelector } from "@/state/redux";
import { useGetPropertiesQuery } from "@/state/api";
import { Property } from "@/types/prismaTypes";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const filters = useAppSelector((state) => state.global.filters);
  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);

  useEffect(() => {
    if (isLoading || isError || !properties) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      // Using streets-v12 for better 3D building support
      style: "mapbox://styles/mapbox/streets-v12",
      center: filters.coordinates || [-74.5, 40],
      zoom: 15, // Higher zoom to see 3D buildings better
      // 3D Camera Settings: pitch tilts the camera angle for 3D perspective
      pitch: 45,
      // bearing rotates the map orientation for a more dynamic view
      bearing: -17.6,
      // Enable anti-aliasing for smoother 3D rendering
      antialias: true,
    });

    // Add 3D terrain and buildings once the map style is loaded
    map.on("style.load", () => {
      // Add Mapbox DEM source for real terrain elevation
      // This enables actual elevation data from Mapbox's terrain tiles
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        // maxzoom determines the maximum detail level for terrain
        maxzoom: 14,
      });

      // Enable 3D terrain rendering with exaggeration factor
      // exaggeration: 1.5 makes hills/mountains 1.5x taller for visual effect
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

      // Add 3D buildings layer using fill-extrusion
      // This renders buildings with height based on their real data
      const layers = map.getStyle().layers;
      // Find the first symbol layer to insert buildings below labels
      const labelLayerId = layers?.find(
        (layer) => layer.type === "symbol" && layer.layout?.["text-field"]
      )?.id;

      map.addLayer(
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

    properties.forEach((property) => {
      const marker = createPropertyMarker(property, map);
      const markerElement = marker.getElement();
      const path = markerElement.querySelector("path[fill='#3FB1CE']");
      if (path) path.setAttribute("fill", "#000000");
    });

    const resizeMap = () => {
      if (map) setTimeout(() => map.resize(), 700);
    };
    resizeMap();

    return () => map.remove();
  }, [isLoading, isError, properties, filters.coordinates]);

  return (
    <div className="basis-5/12 grow relative rounded-xl overflow-hidden">
      {(isLoading || isError || !properties) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white text-black font-bold">
          {isLoading ? "Loading..." : "Failed to fetch properties"}
        </div>
      )}
      <div
        className="map-container rounded-xl"
        ref={mapContainerRef}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </div>
  );
};

const createPropertyMarker = (property: Property, map: mapboxgl.Map) => {
  const marker = new mapboxgl.Marker()
    .setLngLat([
      property.location.coordinates.longitude,
      property.location.coordinates.latitude,
    ])
    .setPopup(
      new mapboxgl.Popup().setHTML(
        `
        <div class="marker-popup">
          <div class="marker-popup-image"></div>
          <div>
            <a href="/search/${property.id}" target="_blank" class="marker-popup-title">${property.name}</a>
            <p class="marker-popup-price">
              $${property.pricePerMonth}
              <span class="marker-popup-price-unit"> / month</span>
            </p>
          </div>
        </div>
        `
      )
    )
    .addTo(map);
  return marker;
};

export default Map;
