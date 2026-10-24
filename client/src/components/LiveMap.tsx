import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ExternalLink, Navigation2, RefreshCw } from 'lucide-react';
import { LocationSnapshot } from '../types';

interface LiveMapProps {
  location: LocationSnapshot;
  isEmergency?: boolean;
  onRefresh?: () => void;
  height?: string;
  zoom?: number;
}

export const LiveMap: React.FC<LiveMapProps> = ({
  location,
  isEmergency = false,
  onRefresh,
  height = '320px',
  zoom = 15,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet map instance once
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [location.latitude, location.longitude],
        zoom: zoom,
        zoomControl: false,
      });

      // CartoDB Positron / OSM tiles (clean, elegant, muted warm aesthetic)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Custom pulsing marker icon
      const customIcon = L.divIcon({
        className: 'custom-pulse-marker',
        html: `
          <div style="
            width: 18px; 
            height: 18px; 
            border-radius: 50%; 
            background: ${isEmergency ? '#B42335' : '#45233F'}; 
            border: 3px solid #FFFFFF; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          "></div>
        `,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      const marker = L.marker([location.latitude, location.longitude], { icon: customIcon }).addTo(map);
      const circle = L.circle([location.latitude, location.longitude], {
        radius: location.accuracyMeters,
        color: isEmergency ? '#B42335' : '#713B60',
        fillColor: isEmergency ? '#B42335' : '#C98298',
        fillOpacity: 0.15,
        weight: 1.5,
      }).addTo(map);

      markerRef.current = marker;
      circleRef.current = circle;
      mapInstanceRef.current = map;
    } else {
      // Update existing map coordinates smoothly
      const map = mapInstanceRef.current;
      map.setView([location.latitude, location.longitude], zoom);

      if (markerRef.current) {
        markerRef.current.setLatLng([location.latitude, location.longitude]);
      }
      if (circleRef.current) {
        circleRef.current.setLatLng([location.latitude, location.longitude]);
        circleRef.current.setRadius(location.accuracyMeters);
        circleRef.current.setStyle({
          color: isEmergency ? '#B42335' : '#713B60',
          fillColor: isEmergency ? '#B42335' : '#C98298',
        });
      }
    }

    return () => {
      // Map cleanup on unmount
    };
  }, [location.latitude, location.longitude, location.accuracyMeters, isEmergency, zoom]);

  // Cleanup map instance on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border-subtle shadow-soft bg-ivory-warm">
      {/* Map Header Floating Overlay */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex items-center justify-between pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border-subtle/80 shadow-sm flex items-center space-x-2 pointer-events-auto">
          <Navigation2 className={`w-3.5 h-3.5 ${isEmergency ? 'text-status-emergency animate-pulse' : 'text-plum'}`} />
          <span className="text-xs font-bold text-plum">
            {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
          </span>
          <span className="text-[10px] text-text-secondary bg-rose-blush px-1.5 py-0.5 rounded">
            ±{location.accuracyMeters}m
          </span>
        </div>

        <div className="flex items-center space-x-2 pointer-events-auto">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 bg-white/95 backdrop-blur-md rounded-xl border border-border-subtle/80 text-plum hover:bg-rose-blush transition-colors shadow-sm"
              title="Refresh GPS snapshot"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-plum text-ivory-warm rounded-xl text-xs font-semibold hover:bg-plum-800 transition-colors shadow-sm"
          >
            <span>Directions</span>
            <ExternalLink className="w-3 h-3 text-champagne" />
          </a>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} style={{ height }} className="w-full" />

      {/* Bottom Address bar */}
      {location.address && (
        <div className="p-2.5 bg-white border-t border-border-subtle/80 text-xs text-text-secondary flex items-center justify-between">
          <span className="truncate max-w-[85%]">{location.address}</span>
          <span className="text-[10px] font-semibold text-plum uppercase tracking-wider">
            {location.source}
          </span>
        </div>
      )}
    </div>
  );
};
