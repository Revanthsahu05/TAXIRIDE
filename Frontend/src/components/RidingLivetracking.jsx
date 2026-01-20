import React, { useRef, useEffect, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "../App.css";

export default function RidingLivetracking() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const zoom = 14;

  maptilersdk.config.apiKey = import.meta.env.VITE_MAPS_API_KEY;

  useEffect(() => {
    // Watch user's current position continuously
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const coords = {
          lng: position.coords.longitude,
          lat: position.coords.latitude,
        };
        console.log("Updated location:", coords);
        setUserLocation(coords);
      },
      (error) => {
        console.error("Error getting user location:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    // Stop watching when component unmounts
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    // Initialize map if it doesn't exist
    if (!map.current) {
      map.current = new maptilersdk.Map({
        container: mapContainer.current,
        style: maptilersdk.MapStyle.STREETS,
        center: [userLocation.lng, userLocation.lat],
        zoom: zoom,
      });

      // Initialize marker
      marker.current = new maptilersdk.Marker({ color: "#FF0000" })
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(map.current);
    } else {
      // Update marker position and pan map
      if (marker.current) {
        marker.current.setLngLat([userLocation.lng, userLocation.lat]);
      }
      map.current.panTo([userLocation.lng, userLocation.lat]);
    }
  }, [userLocation]);

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}
