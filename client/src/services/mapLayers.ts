export type MapLayerView = 'normal' | 'satellite' | 'magnitude';

export interface MapLayerConfig {
  id: MapLayerView;
  label: string;
  iconName: string;
  badgeLabel: string;
  url: string;
  attribution: string;
  maxZoom: number;
  subdomains?: string[];
  description: string;
}

export interface EarthMagnitudeData {
  fieldIntensityMicroTesla: number;
  inclinationDegrees: number;
  declinationDegrees: number;
  intensityZone: string;
  elevationMeters?: number | null;
}

const STORAGE_KEY_LAYER = 'pushprotect_preferred_map_layer';
const STORAGE_KEY_CUSTOM_KEY = 'pushprotect_custom_map_key';

/**
 * Returns configuration for the 3 switchable map layer views.
 * If user has supplied a custom API key (e.g. Mapbox/Carto), it can be injected.
 */
export function getMapLayerConfig(view: MapLayerView, customApiKey?: string): MapLayerConfig {
  const activeKey = customApiKey || getStoredCustomApiKey();
  const isGoogleMapsKey = Boolean(activeKey && (activeKey.startsWith('AIzaSy') || activeKey.length === 39));
  const isMapboxKey = Boolean(activeKey && activeKey.startsWith('pk.'));

  switch (view) {
    case 'satellite':
      if (isGoogleMapsKey) {
        return {
          id: 'satellite',
          label: 'Google Satellite',
          iconName: 'Satellite',
          badgeLabel: '🛰️ Google Hybrid Satellite (Live API)',
          url: `https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&key=${activeKey}`,
          attribution: '&copy; Google Maps Satellite & Aerial',
          maxZoom: 20,
          subdomains: ['0', '1', '2', '3'],
          description: 'Official Google Maps high-resolution hybrid satellite imagery with street & landmark overlays.',
        };
      }
      if (isMapboxKey) {
        return {
          id: 'satellite',
          label: 'Satellite',
          iconName: 'Satellite',
          badgeLabel: '🛰️ Mapbox Satellite View',
          url: `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${activeKey}`,
          attribution: '&copy; Mapbox &copy; OpenStreetMap contributors',
          maxZoom: 19,
          description: 'Photorealistic orbital satellite imagery providing real-world physical ground features and building rooftops.',
        };
      }
      return {
        id: 'satellite',
        label: 'Satellite',
        iconName: 'Satellite',
        badgeLabel: '🛰️ High-Res Satellite View',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and GIS User Community',
        maxZoom: 19,
        description: 'True photorealistic orbital satellite imagery providing real-world physical ground features and building rooftops.',
      };

    case 'magnitude':
      if (isGoogleMapsKey) {
        return {
          id: 'magnitude',
          label: "Google Terrain",
          iconName: 'Globe',
          badgeLabel: "🌋 Google Maps Relief & Topography (Live API)",
          url: `https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}&key=${activeKey}`,
          attribution: '&copy; Google Maps Terrain',
          maxZoom: 20,
          subdomains: ['0', '1', '2', '3'],
          description: 'Official Google Maps terrain elevation, contour topography, and geomagnetic magnitude calculation.',
        };
      }
      return {
        id: 'magnitude',
        label: "Earth's Magnitude",
        iconName: 'Globe',
        badgeLabel: "🌋 Earth's Relief & Magnetic Magnitude",
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors, SRTM | Style: &copy; <a href="https://opentopomap.org" target="_blank">OpenTopoMap</a> (CC-BY-SA)',
        maxZoom: 17,
        subdomains: ['a', 'b', 'c'],
        description: "Contour elevations, terrain relief shading, and real-time Earth geomagnetic field magnitude calculation.",
      };

    case 'normal':
    default:
      if (isGoogleMapsKey) {
        return {
          id: 'normal',
          label: 'Google Maps GPS',
          iconName: 'Map',
          badgeLabel: '📍 Official Google Maps Roadmap (Live API)',
          url: `https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${activeKey}`,
          attribution: '&copy; Google Maps',
          maxZoom: 20,
          subdomains: ['0', '1', '2', '3'],
          description: 'Official Google Maps vector cartography with live traffic, building footprints, and verified routes.',
        };
      }
      return {
        id: 'normal',
        label: 'Normal GPS',
        iconName: 'Map',
        badgeLabel: '📍 Standard GPS Street Map',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
        description: 'Standard road cartography with street names, building numbers, junctions, and verified landmarks.',
      };
  }
}

/**
 * Computes deterministic Earth geomagnetic field intensity and dipole angles
 * based on geographic coordinates (WMM/IGRF dipole approximation model).
 */
export function calculateEarthMagnitude(lat: number, lon: number): EarthMagnitudeData {
  const latRad = (lat * Math.PI) / 180;
  const sinLat = Math.sin(latRad);

  // Dipole total field: B(lat) = B0 * sqrt(1 + 3 * sin^2(lat))
  // B0 ≈ 31.2 µT at geomagnetic equator
  const totalField = 31.2 * Math.sqrt(1 + 3 * sinLat * sinLat);

  // Magnetic inclination (dip): tan(I) = 2 * tan(lat)
  const inclination = (Math.atan(2 * Math.tan(latRad)) * 180) / Math.PI;

  // Approximate declination based on regional coordinates
  const declination = ((lon % 30) - 15) * 0.25;

  let intensityZone = 'Moderate Intensity';
  if (totalField > 52) intensityZone = 'High Polar Field Belt';
  else if (totalField < 36) intensityZone = 'Equatorial Minimum Intensity';

  return {
    fieldIntensityMicroTesla: Math.round(totalField * 10) / 10,
    inclinationDegrees: Math.round(inclination * 10) / 10,
    declinationDegrees: Math.round(declination * 10) / 10,
    intensityZone,
  };
}

/**
 * Fetches real elevation (meters above sea level) from Open-Meteo Elevation API
 */
export async function fetchLocationElevation(lat: number, lon: number): Promise<number | null> {
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lon}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && Array.isArray(data.elevation) && data.elevation.length > 0) {
      return Math.round(data.elevation[0]);
    }
    return null;
  } catch {
    return null;
  }
}

export function getStoredMapPreference(): MapLayerView {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LAYER);
    if (saved === 'satellite' || saved === 'magnitude' || saved === 'normal') {
      return saved;
    }
  } catch {
    // ignore
  }
  return 'normal';
}

export function setStoredMapPreference(view: MapLayerView): void {
  try {
    localStorage.setItem(STORAGE_KEY_LAYER, view);
  } catch {
    // ignore
  }
}

export function getStoredCustomApiKey(): string {
  try {
    const envKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;
    if (envKey && typeof envKey === 'string' && envKey.trim().length > 5) {
      return envKey.trim();
    }
    return localStorage.getItem(STORAGE_KEY_CUSTOM_KEY) || '';
  } catch {
    return '';
  }
}

export function setStoredCustomApiKey(key: string): void {
  try {
    if (key.trim()) {
      localStorage.setItem(STORAGE_KEY_CUSTOM_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_CUSTOM_KEY);
    }
  } catch {
    // ignore
  }
}
