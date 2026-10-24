import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import {
  ExternalLink,
  Navigation2,
  RefreshCw,
  Satellite,
  Globe,
  Map as MapIcon,
  Sliders,
  Activity,
  Check,
  X,
  Key,
  Shield,
  Info,
} from 'lucide-react';
import { LocationSnapshot } from '../types';
import {
  MapLayerView,
  getMapLayerConfig,
  calculateEarthMagnitude,
  fetchLocationElevation,
  getStoredMapPreference,
  setStoredMapPreference,
  getStoredCustomApiKey,
  setStoredCustomApiKey,
} from '../services/mapLayers';

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
  height = '340px',
  zoom = 15,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const activeTileLayerRef = useRef<L.TileLayer | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  const [activeLayer, setActiveLayer] = useState<MapLayerView>(getStoredMapPreference);
  const [elevationMeters, setElevationMeters] = useState<number | null>(null);
  const [showApiModal, setShowApiModal] = useState<boolean>(false);
  const [customKeyInput, setCustomKeyInput] = useState<string>(getStoredCustomApiKey);
  const [savedKeyNotice, setSavedKeyNotice] = useState<boolean>(false);

  // Compute Earth's Geomagnetic Magnitude for current coordinates
  const earthMagnitude = useMemo(() => {
    return calculateEarthMagnitude(location.latitude, location.longitude);
  }, [location.latitude, location.longitude]);

  // Fetch real-time elevation when coordinates change
  useEffect(() => {
    let isMounted = true;
    fetchLocationElevation(location.latitude, location.longitude).then((elev) => {
      if (isMounted) setElevationMeters(elev);
    });
    return () => {
      isMounted = false;
    };
  }, [location.latitude, location.longitude]);

  // Switch or mount Leaflet tile layer
  const applyTileLayer = (layerType: MapLayerView, map: L.Map) => {
    if (activeTileLayerRef.current) {
      map.removeLayer(activeTileLayerRef.current);
    }

    const config = getMapLayerConfig(layerType);
    const newTileLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
      subdomains: config.subdomains || 'abc',
    });

    newTileLayer.addTo(map);
    activeTileLayerRef.current = newTileLayer;
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [location.latitude, location.longitude],
        zoom: zoom,
        zoomControl: false,
      });

      // Apply initial tile layer based on preferred setting
      applyTileLayer(activeLayer, map);

      // Add zoom control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Custom pulsing marker icon with high visibility on both light and dark satellite layers
      const customIcon = L.divIcon({
        className: 'custom-pulse-marker',
        html: `
          <div style="
            position: relative;
            width: 22px; 
            height: 22px; 
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              position: absolute;
              width: 22px;
              height: 22px;
              border-radius: 50%;
              background: ${isEmergency ? '#B42335' : '#45233F'};
              opacity: 0.35;
              animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
            <div style="
              width: 16px; 
              height: 16px; 
              border-radius: 50%; 
              background: ${isEmergency ? '#B42335' : '#45233F'}; 
              border: 3px solid #FFFFFF; 
              box-shadow: 0 0 10px rgba(0,0,0,0.5);
              position: relative;
              z-index: 2;
            "></div>
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker([location.latitude, location.longitude], { icon: customIcon }).addTo(map);
      const circle = L.circle([location.latitude, location.longitude], {
        radius: location.accuracyMeters,
        color: isEmergency ? '#B42335' : '#713B60',
        fillColor: isEmergency ? '#B42335' : '#C98298',
        fillOpacity: 0.18,
        weight: 1.5,
      }).addTo(map);

      markerRef.current = marker;
      circleRef.current = circle;
      mapInstanceRef.current = map;
    } else {
      // Update coordinates
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
  }, [location.latitude, location.longitude, location.accuracyMeters, isEmergency, zoom]);

  // Handle Layer Switch
  const handleLayerSwitch = (layer: MapLayerView) => {
    setActiveLayer(layer);
    setStoredMapPreference(layer);
    if (mapInstanceRef.current) {
      applyTileLayer(layer, mapInstanceRef.current);
    }
  };

  // Handle Custom API Key Save
  const handleSaveApiKey = () => {
    setStoredCustomApiKey(customKeyInput);
    setSavedKeyNotice(true);
    setTimeout(() => setSavedKeyNotice(false), 2500);

    // Refresh active layer if on satellite
    if (mapInstanceRef.current) {
      applyTileLayer(activeLayer, mapInstanceRef.current);
    }
  };

  // Cleanup on unmount
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
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex items-center justify-between pointer-events-none gap-2">
        {/* GPS Coordinate & Precision Tag */}
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border-subtle/80 shadow-sm flex items-center space-x-2 pointer-events-auto">
          <Navigation2 className={`w-3.5 h-3.5 ${isEmergency ? 'text-status-emergency animate-pulse' : 'text-plum'}`} />
          <span className="text-xs font-bold text-plum">
            {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
          </span>
          <span className="text-[10px] text-text-secondary bg-rose-blush px-1.5 py-0.5 rounded font-medium">
            ±{location.accuracyMeters}m
          </span>
        </div>

        {/* Action Buttons: API Settings, Refresh, Directions */}
        <div className="flex items-center space-x-1.5 pointer-events-auto">
          <button
            onClick={() => setShowApiModal(true)}
            className="p-1.5 bg-white/95 backdrop-blur-md rounded-xl border border-border-subtle/80 text-plum hover:bg-rose-blush/60 transition-colors shadow-sm"
            title="Map Layer APIs & Key Connection"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 bg-white/95 backdrop-blur-md rounded-xl border border-border-subtle/80 text-plum hover:bg-rose-blush/60 transition-colors shadow-sm"
              title="Refresh GPS snapshot"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 px-2.5 py-1.5 bg-plum text-ivory-warm rounded-xl text-xs font-semibold hover:bg-plum-800 transition-colors shadow-sm"
          >
            <span>Directions</span>
            <ExternalLink className="w-3 h-3 text-champagne" />
          </a>
        </div>
      </div>

      {/* Floating 3-Option Layer Switcher */}
      <div className="absolute bottom-2.5 left-2.5 z-[400] bg-white/95 backdrop-blur-md rounded-xl border border-border-subtle/90 p-1 shadow-md flex items-center space-x-1 max-w-[calc(100%-68px)] overflow-x-auto scrollbar-none">
        {/* Option 1: Satellite View */}
        <button
          type="button"
          onClick={() => handleLayerSwitch('satellite')}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
            activeLayer === 'satellite'
              ? 'bg-plum text-ivory-warm shadow-xs scale-102'
              : 'text-text-secondary hover:text-plum hover:bg-rose-blush/40'
          }`}
          title="Switch to High-Resolution Satellite View (Esri ArcGIS Imagery)"
        >
          <Satellite className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Satellite</span>
        </button>

        {/* Option 2: Earth's Magnitude View */}
        <button
          type="button"
          onClick={() => handleLayerSwitch('magnitude')}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
            activeLayer === 'magnitude'
              ? 'bg-plum text-ivory-warm shadow-xs scale-102'
              : 'text-text-secondary hover:text-plum hover:bg-rose-blush/40'
          }`}
          title="Switch to Earth's Magnitude View (OpenTopoMap & Geomagnetic Field)"
        >
          <Globe className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            <span className="hidden xs:inline">Earth </span>Magnitude
          </span>
        </button>

        {/* Option 3: Normal GPS View */}
        <button
          type="button"
          onClick={() => handleLayerSwitch('normal')}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
            activeLayer === 'normal'
              ? 'bg-plum text-ivory-warm shadow-xs scale-102'
              : 'text-text-secondary hover:text-plum hover:bg-rose-blush/40'
          }`}
          title="Switch to Normal GPS View (OpenStreetMap)"
        >
          <MapIcon className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            <span className="hidden xs:inline">Normal </span>GPS
          </span>
        </button>
      </div>

      {/* Telemetry HUD Banner when in Earth's Magnitude View */}
      {activeLayer === 'magnitude' && (
        <div className="absolute top-14 left-3 right-3 z-[399] bg-plum/90 backdrop-blur-md text-ivory-warm rounded-xl px-3 py-1.5 border border-plum-800 shadow-md flex items-center justify-between text-[11px] animate-fadeIn">
          <div className="flex items-center space-x-2">
            <Activity className="w-3.5 h-3.5 text-champagne animate-pulse" />
            <span className="font-semibold text-champagne">Earth Field:</span>
            <span>{earthMagnitude.fieldIntensityMicroTesla} µT</span>
            <span className="text-white/60">({earthMagnitude.intensityZone})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-white/60">Dip: {earthMagnitude.inclinationDegrees}°</span>
            {elevationMeters !== null && (
              <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-ivory font-mono">
                Elev: {elevationMeters}m ASL
              </span>
            )}
          </div>
        </div>
      )}

      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} style={{ height }} className="w-full" />

      {/* Bottom Address bar */}
      {location.address && (
        <div className="p-2.5 bg-white border-t border-border-subtle/80 text-xs text-text-secondary flex items-center justify-between gap-3">
          <span className="truncate flex-1 font-medium text-plum" title={location.address}>
            {location.address}
          </span>
          <span className="text-[10px] font-bold text-plum uppercase tracking-wider bg-rose-blush/60 px-2 py-0.5 rounded whitespace-nowrap flex-shrink-0 border border-border-subtle/50">
            {activeLayer === 'satellite'
              ? 'SATELLITE API'
              : activeLayer === 'magnitude'
              ? 'EARTH TOPO API'
              : 'OSM GPS API'}
          </span>
        </div>
      )}

      {/* API Connections & Custom Key Configuration Modal */}
      {showApiModal && (
        <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-border-subtle max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-plum text-champagne flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-plum">Location & Map API Connections</h3>
                  <p className="text-[11px] text-text-secondary">3 switchable view engines & telemetry integrations</p>
                </div>
              </div>
              <button
                onClick={() => setShowApiModal(false)}
                className="p-1 rounded-lg text-text-secondary hover:text-plum hover:bg-rose-blush/40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* API Status Cards */}
            <div className="space-y-2.5 text-xs">
              {/* Satellite API */}
              <div className="p-3 rounded-2xl bg-ivory-warm border border-border-subtle flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-plum">
                    <Satellite className="w-3.5 h-3.5 text-plum" />
                    <span>1. Satellite View Engine</span>
                  </div>
                  <p className="text-[11px] text-text-secondary">
                    Esri ArcGIS World Imagery Service. High-resolution orbital satellite & aerial photography. 100% free, zero key required.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                  Connected (Active)
                </span>
              </div>

              {/* Earth's Magnitude API */}
              <div className="p-3 rounded-2xl bg-ivory-warm border border-border-subtle flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-plum">
                    <Globe className="w-3.5 h-3.5 text-plum" />
                    <span>2. Earth's Magnitude Engine</span>
                  </div>
                  <p className="text-[11px] text-text-secondary">
                    OpenTopoMap (SRTM contours & hillshading) + Open-Meteo Elevation + Geomagnetic Dipole calculation. Zero key required.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                  Connected (Active)
                </span>
              </div>

              {/* Normal GPS API */}
              <div className="p-3 rounded-2xl bg-ivory-warm border border-border-subtle flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-plum">
                    <MapIcon className="w-3.5 h-3.5 text-plum" />
                    <span>3. Normal GPS View Engine</span>
                  </div>
                  <p className="text-[11px] text-text-secondary">
                    OpenStreetMap (OSM) Global Vector Tile Service. 100% open, verified street names, building footprints, and landmarks.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                  Connected (Active)
                </span>
              </div>

              {/* Live Location Engine Card */}
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-emerald-900">
                    <Navigation2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Real-time Live GPS Sensor</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Uses device GNSS/cellular hardware via native browser Geolocation API. Reverse geocoded via OpenStreetMap Nominatim and BigDataCloud. No Google Cloud billing required.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-full whitespace-nowrap">
                  Live Sensor
                </span>
              </div>
            </div>

            {/* Optional Custom Key / Google Override */}
            <div className="p-3 rounded-2xl border border-dashed border-border-subtle bg-ivory-warm/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-text-secondary">
                  <Key className="w-3.5 h-3.5 text-plum" />
                  <span>Optional: Custom API Key Override</span>
                </div>
                <span className="text-[10px] text-text-secondary italic">Not required for live maps</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Paste optional key (e.g. Mapbox pk... or Google AIzaSy...)"
                  value={customKeyInput}
                  onChange={(e) => setCustomKeyInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-border-subtle bg-white focus:outline-none focus:ring-1 focus:ring-plum font-mono"
                />
                <button
                  type="button"
                  onClick={handleSaveApiKey}
                  className="px-3 py-1.5 bg-plum text-ivory-warm text-xs font-semibold rounded-xl hover:bg-plum-800 transition-colors flex items-center space-x-1 shadow-sm"
                >
                  <Check className="w-3 h-3 text-champagne" />
                  <span>Save</span>
                </button>
              </div>
              {savedKeyNotice && (
                <p className="text-[10px] text-emerald-700 font-bold animate-fadeIn">
                  ✓ Custom key preference updated!
                </p>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowApiModal(false)}
                className="px-4 py-2 bg-plum text-ivory-warm text-xs font-bold rounded-xl hover:bg-plum-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
