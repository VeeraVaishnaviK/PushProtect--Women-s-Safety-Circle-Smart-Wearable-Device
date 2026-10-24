import { DeviceDocument } from '../schemas/domain.schemas';
export declare class DevicesController {
    private devices;
    pairDevice(body: any): DeviceDocument;
    getDevices(): DeviceDocument[];
    unpairDevice(id: string): {
        success: boolean;
        message: string;
    };
}
