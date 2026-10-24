import { LocationSnapshot } from '../types';

export class LocationService {
  private static lastKnownLocation: LocationSnapshot | null = {
    latitude: 28.6139,
    longitude: 77.2090, // New Delhi default fallback coordinate
    accuracyMeters: 14,
    capturedAt: new Date(Date.now() - 45000).toISOString(),
    source: 'simulated',
    address: 'Near Connaught Place, New Delhi, India',
  };

  private static watchId: number | null = null;

  public static getLastKnownLocation(): LocationSnapshot {
    if (this.lastKnownLocation) {
      return this.lastKnownLocation;
    }
    return {
      latitude: 28.6139,
      longitude: 77.2090,
      accuracyMeters: 25,
      capturedAt: new Date().toISOString(),
      source: 'cached',
      address: 'Central District, New Delhi',
    };
  }

  public static async getCurrentLocation(): Promise<LocationSnapshot> {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return this.getLastKnownLocation();
    }

    return new Promise((resolve) => {
      // Timeout quickly (5s) so SOS activation is NEVER blocked by waiting for GPS fix!
      const timeoutId = setTimeout(() => {
        resolve(this.getLastKnownLocation());
      }, 4500);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          clearTimeout(timeoutId);
          const snapshot: LocationSnapshot = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracyMeters: Math.round(position.coords.accuracy || 15),
            capturedAt: new Date(position.timestamp || Date.now()).toISOString(),
            source: 'gps',
          };

          // Try reverse geocoding in background
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${snapshot.latitude}&lon=${snapshot.longitude}`,
              { headers: { 'User-Agent': 'PushProtect/1.0' } }
            );
            if (res.ok) {
              const data = await res.json();
              snapshot.address = data.display_name || `${snapshot.latitude.toFixed(4)}, ${snapshot.longitude.toFixed(4)}`;
            }
          } catch {
            snapshot.address = `${snapshot.latitude.toFixed(4)}, ${snapshot.longitude.toFixed(4)}`;
          }

          this.lastKnownLocation = snapshot;
          resolve(snapshot);
        },
        () => {
          clearTimeout(timeoutId);
          // Return last known cached location gracefully on permission deny or timeout
          resolve(this.getLastKnownLocation());
        },
        {
          enableHighAccuracy: true,
          timeout: 4000,
          maximumAge: 30000, // 30s cache acceptable for instant initial snapshot
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
