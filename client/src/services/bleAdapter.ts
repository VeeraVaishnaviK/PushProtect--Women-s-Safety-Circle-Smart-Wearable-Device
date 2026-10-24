import { WearableDevice } from '../types';

export interface BLEEventListener {
  onSOSEvent: (data: { eventId: string; deviceId: string; timestamp: string }) => void;
  onBatteryUpdate: (level: number) => void;
  onConnectionChange: (connected: boolean) => void;
}

export class WearableBLEAdapter {
  private static instance: WearableBLEAdapter;
  private currentDevice: WearableDevice | null = null;
  private listeners: BLEEventListener[] = [];
  private simulatedBatteryInterval: any = null;

  // UUIDs for Push Protect Smart SOS Wearable
  public static readonly PUSH_PROTECT_SERVICE_UUID = '00001824-0000-1000-8000-00805f9b34fb';
  public static readonly SOS_CHAR_UUID = '00002a3d-0000-1000-8000-00805f9b34fb';
  public static readonly BATTERY_CHAR_UUID = '00002a19-0000-1000-8000-00805f9b34fb';

  private constructor() {
    // Default initial mock paired device
    this.currentDevice = {
      id: 'pp-device-esp32-v3',
      name: 'Push Protect Ring / Charm v1',
      deviceIdentifier: 'PP-ESP32-8F92',
      macAddress: 'DC:54:75:8F:92:B1',
      pairingStatus: 'connected',
      batteryLevel: 88,
      firmwareVersion: 'v1.4.2-rel',
      lastSeenAt: new Date().toISOString(),
      hardwareModel: 'ESP32-S3-WROOM-BLE5.0',
      isSimulated: true,
    };
  }

  public static getInstance(): WearableBLEAdapter {
    if (!WearableBLEAdapter.instance) {
      WearableBLEAdapter.instance = new WearableBLEAdapter();
    }
    return WearableBLEAdapter.instance;
  }

  public addListener(listener: BLEEventListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getDevice(): WearableDevice | null {
    return this.currentDevice;
  }

  public isWebBluetoothAvailable(): boolean {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }

  public async scanAndConnectReal(): Promise<WearableDevice> {
    if (!this.isWebBluetoothAvailable()) {
      throw new Error('Web Bluetooth is not supported in this browser. Switching to hardware simulation mode.');
    }

    try {
      // @ts-ignore
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: 'PushProtect' }, { namePrefix: 'PP-' }],
        optionalServices: [
          WearableBLEAdapter.PUSH_PROTECT_SERVICE_UUID,
          WearableBLEAdapter.BATTERY_CHAR_UUID,
          'battery_service',
        ],
      });

      const paired: WearableDevice = {
        id: device.id || 'ble-' + Date.now(),
        name: device.name || 'Push Protect Wearable',
        deviceIdentifier: device.id || 'PP-BLE-' + Math.floor(Math.random() * 9000 + 1000),
        pairingStatus: 'connected',
        batteryLevel: 92,
        firmwareVersion: 'v1.4.2-prod',
        lastSeenAt: new Date().toISOString(),
        hardwareModel: 'ESP32 BLE5',
        isSimulated: false,
      };

      this.currentDevice = paired;
      this.notifyConnection(true);
      return paired;
    } catch (err: any) {
      if (err.name === 'NotFoundError') {
        throw new Error('No device selected or user cancelled BLE pairing.');
      }
      throw err;
    }
  }

  public simulatePairing(deviceName = 'Push Protect Charm S3'): Promise<WearableDevice> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const paired: WearableDevice = {
          id: 'sim-dev-' + Date.now(),
          name: deviceName,
          deviceIdentifier: 'PP-ESP32-' + Math.floor(1000 + Math.random() * 9000),
          macAddress: 'DC:54:75:A1:4B:92',
          pairingStatus: 'connected',
          batteryLevel: 88,
          firmwareVersion: 'v1.4.2-sim',
          lastSeenAt: new Date().toISOString(),
          hardwareModel: 'ESP32-S3 Wearable Edition',
          isSimulated: true,
        };
        this.currentDevice = paired;
        this.notifyConnection(true);
        resolve(paired);
      }, 800);
    });
  }

  public disconnect(): void {
    if (this.currentDevice) {
      this.currentDevice.pairingStatus = 'disconnected';
      this.notifyConnection(false);
    }
  }

  public reconnect(): void {
    if (this.currentDevice) {
      this.currentDevice.pairingStatus = 'connected';
      this.currentDevice.lastSeenAt = new Date().toISOString();
      this.notifyConnection(true);
    }
  }

  public unpair(): void {
    this.currentDevice = null;
    this.notifyConnection(false);
  }

  // Triggered when user presses the physical button on the ESP32 wearable
  public triggerHardwareButtonPress(): { eventId: string; deviceId: string; timestamp: string } {
    const eventId = 'ble-sos-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const deviceId = this.currentDevice?.deviceIdentifier || 'PP-OFFLINE-DEVICE';
    const timestamp = new Date().toISOString();

    if (this.currentDevice) {
      this.currentDevice.lastSeenAt = timestamp;
    }

    const payload = { eventId, deviceId, timestamp };
    this.listeners.forEach((l) => l.onSOSEvent(payload));
    return payload;
  }

  public updateBatteryLevel(level: number) {
    if (this.currentDevice) {
      this.currentDevice.batteryLevel = Math.max(0, Math.min(100, level));
      this.currentDevice.lastSeenAt = new Date().toISOString();
      this.listeners.forEach((l) => l.onBatteryUpdate(this.currentDevice!.batteryLevel!));
    }
  }

  private notifyConnection(connected: boolean) {
    this.listeners.forEach((l) => l.onConnectionChange(connected));
  }
}

export const bleAdapter = WearableBLEAdapter.getInstance();
