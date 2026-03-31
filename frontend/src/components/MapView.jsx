import { GoogleMap, LoadScript, DirectionsRenderer } from "@react-google-maps/api";
import { useState, useEffect } from "react";

const containerStyle = {
  width: "100%",
  height: "350px",
  borderRadius: "28px",
};

const center = {
  lat: 9.9312,   // Kochi default
  lng: 76.2673,
};

function MapView({ destination }) {
  const [directions, setDirections] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(false);

  const getRoute = (map) => {
    if (!destination || !window.google) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: center,
        destination: destination,
        travelMode: "DRIVING", // Changed to DRIVING for emergency response
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
          setError(false);
        } else {
          console.error("Directions request failed:", status);
          setError(true);
        }
      }
    );
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div style={{
        height: "350px",
        background: "var(--code-bg)",
        borderRadius: "28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text)"
      }}>
        ⚠️ Google Maps API key required
      </div>
    );
  }

  return (
    <LoadScript 
      googleMapsApiKey={apiKey}
      onLoad={() => setMapLoaded(true)}
      onError={() => setError(true)}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        onLoad={getRoute}
        options={{
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
          disableDefaultUI: false,
          zoomControl: true,
        }}
      >
        {directions && (
          <DirectionsRenderer 
            directions={directions} 
            options={{
              polylineOptions: {
                strokeColor: "#c241ff",
                strokeWeight: 5,
                strokeOpacity: 0.8,
              },
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}

export default MapView;