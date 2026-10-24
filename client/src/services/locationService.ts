import { LocationSnapshot } from '../types';
import { getStoredCustomApiKey } from './mapLayers';

export class LocationService {
  private static lastKnownLocation: LocationSnapshot | null = {
    latitude: 13.0475,
    longitude: 80.2824, // Marina Beach, Chennai, Tamil Nadu
    accuracyMeters: 14,
    capturedAt: new Date(Date.now() - 45000).toISOString(),
    source: 'simulated',
    address: 'Near Marina Beach Road, Chennai, Tamil Nadu, India',
  };

  public static getLastKnownLocation(): LocationSnapshot {
    if (this.lastKnownLocation) {
      return this.lastKnownLocation;
    }
    return {
      latitude: 13.0475,
      longitude: 80.2824,
      accuracyMeters: 20,
      capturedAt: new Date().toISOString(),
      source: 'cached',
      address: 'Marina Beach, Triplicane, Chennai, Tamil Nadu',
    };
  }

  /**
   * Reverse geocodes coordinates to street address using Google Maps Geocoding API if key is present,
   * falling back to OpenStreetMap Nominatim.
   */
  public static async reverseGeocode(lat: number, lon: number): Promise<string> {
    const customKey = getStoredCustomApiKey();
    const isGoogleKey = Boolean(customKey && (customKey.startsWith('AIzaSy') || customKey.length === 39));

    // 1. Try Google Maps Geocoding API if key provided
    if (isGoogleKey) {
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${customKey}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            return data.results[0].formatted_address;
          }
        }
      } catch (err) {
        console.warn('Google Geocoding API request failed, falling back to OSM:', err);
      }
    }

    // 2. OpenStreetMap Nominatim reverse geocode fallback
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
        { headers: { 'User-Agent': 'PushProtect/1.0' } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.display_name) {
          return data.display_name;
        }
      }
    } catch {
      // ignore
    }

    // 3. BigDataCloud free client reverse geocoding fallback (no API key needed, high reliability)
    try {
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      if (res.ok) {
        const data = await res.json();
        const parts = [
          data.locality || data.city,
          data.principalSubdivision,
          data.countryName,
        ].filter(Boolean);
        if (parts.length > 0) {
          return parts.join(', ');
        }
      }
    } catch {
      // ignore
    }

    return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  }

  /**
   * Continuous real-time live location tracking using device GPS sensor.
   * Updates coordinates as the user moves. Returns an unsubscribe function.
   */
  public static watchRealLocation(
    onLocation: (loc: LocationSnapshot) => void,
    onError?: (err: Error) => void
  ): () => void {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      if (onError) onError(new Error('Geolocation is not supported by your browser.'));
      return () => {};
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const snapshot: LocationSnapshot = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracyMeters: Math.round(position.coords.accuracy || 8),
          capturedAt: new Date(position.timestamp || Date.now()).toISOString(),
          source: 'gps',
        };

        this.lastKnownLocation = snapshot;
        onLocation(snapshot);

        // Async resolve address in background
        this.reverseGeocode(snapshot.latitude, snapshot.longitude).then((addr) => {
          snapshot.address = addr;
          this.lastKnownLocation = snapshot;
          onLocation({ ...snapshot, address: addr });
        });
      },
      (error) => {
        if (onError) {
          onError(new Error(error.message || 'Error tracking live location.'));
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }

  /**
   * Fast, non-blocking GPS grab for emergency workflows (never hangs on SOS)
   */
  public static async getCurrentLocation(): Promise<LocationSnapshot> {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return this.getLastKnownLocation();
    }

    return new Promise((resolve) => {
      // 4.5s safe timeout so emergency SOS dispatch is never blocked
      const timeoutId = setTimeout(() => {
        resolve(this.getLastKnownLocation());
      }, 4500);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          clearTimeout(timeoutId);
          const snapshot: LocationSnapshot = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracyMeters: Math.round(position.coords.accuracy || 12),
            capturedAt: new Date(position.timestamp || Date.now()).toISOString(),
            source: 'gps',
          };

          snapshot.address = await this.reverseGeocode(snapshot.latitude, snapshot.longitude);
          this.lastKnownLocation = snapshot;
          resolve(snapshot);
        },
        () => {
          clearTimeout(timeoutId);
          resolve(this.getLastKnownLocation());
        },
        {
          enableHighAccuracy: true,
          timeout: 4000,
          maximumAge: 15000,
        }
      );
    });
  }

  /**
   * Explicitly requests real physical device GPS from browser with maximum precision.
   * Throws informative error if user denies permission or browser lacks hardware sensor.
   */
  public static async requestRealDeviceGPS(): Promise<LocationSnapshot> {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      throw new Error('Geolocation is not supported by your current browser.');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const snapshot: LocationSnapshot = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracyMeters: Math.round(position.coords.accuracy || 8),
            capturedAt: new Date(position.timestamp || Date.now()).toISOString(),
            source: 'gps',
          };

          snapshot.address = await this.reverseGeocode(snapshot.latitude, snapshot.longitude);
          this.lastKnownLocation = snapshot;
          resolve(snapshot);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error('Location permission denied. Please allow location access in your browser address bar.'));
              break;
            case error.POSITION_UNAVAILABLE:
              reject(new Error('GPS satellite position unavailable. Ensure device location is switched ON.'));
              break;
            case error.TIMEOUT:
              reject(new Error('GPS acquisition timed out. Try again in an open sky area.'));
              break;
            default:
              reject(new Error('Failed to acquire real GPS location.'));
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0, // Force fresh satellite/cellular fix
        }
      );
    });
  }

  public static calculateFreshness(capturedAt: string): {
    seconds: number;
    category: 'fresh' | 'moderate' | 'stale';
    label: string;
  } {
    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(capturedAt).getTime()) / 1000));
    if (elapsedSeconds < 45) {
      return { seconds: elapsedSeconds, category: 'fresh', label: `${elapsedSeconds}s ago (Live)` };
    } else if (elapsedSeconds < 180) {
      const mins = Math.floor(elapsedSeconds / 60);
      return { seconds: elapsedSeconds, category: 'moderate', label: `${mins}m ${elapsedSeconds % 60}s ago` };
    } else {
      const mins = Math.floor(elapsedSeconds / 60);
      return { seconds: elapsedSeconds, category: 'stale', label: `${mins}m ago (Stale GPS)` };
    }
  }

  public static classifyAccuracy(meters: number): {
    category: 'high' | 'medium' | 'degraded';
    label: string;
  } {
    if (meters <= 20) {
      return { category: 'high', label: `±${meters}m (High Precision)` };
    } else if (meters <= 60) {
      return { category: 'medium', label: `±${meters}m (Acceptable)` };
    } else {
      return { category: 'degraded', label: `±${meters}m (Degraded Area)` };
    }
  }
}
