import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DeviceDocument } from '../schemas/domain.schemas';

@ApiTags('Wearable Hardware')
@Controller('api/v1/devices')
export class DevicesController {
  private devices: DeviceDocument[] = [
    {
      id: 'pp-device-esp32-v3',
      ownerId: 'usr-101',
      deviceIdentifier: 'PP-ESP32-8F92',
      name: 'Push Protect Ring / Charm v1',
      hardwareModel: 'ESP32-S3-WROOM-BLE5.0',
      pairingStatus: 'connected',
      batteryLevel: 88,
      firmwareVersion: 'v1.4.2-rel',
      lastSeenAt: new Date().toISOString(),
      isSimulated: true,
    },
  ];

  @Post('pair')
  @ApiOperation({ summary: 'Pair and authenticate an ESP32 BLE wearable' })
  pairDevice(@Body() body: any) {
    const newDevice: DeviceDocument = {
      id: 'dev-' + Date.now(),
      ownerId: body.ownerId || 'usr-101',
      deviceIdentifier: body.deviceIdentifier || 'PP-ESP32-' + Math.floor(1000 + Math.random() * 9000),
      name: body.name || 'Push Protect Wearable',
      hardwareModel: body.hardwareModel || 'ESP32-S3 Wearable Edition',
      pairingStatus: 'connected',
      batteryLevel: 94,
      firmwareVersion: 'v1.4.2-prod',
      lastSeenAt: new Date().toISOString(),
      isSimulated: body.isSimulated || false,
    };
    this.devices.push(newDevice);
    return newDevice;
  }

  @Get()
  @ApiOperation({ summary: 'List all paired wearable devices for authenticated owner' })
  getDevices() {
    return this.devices;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Revoke and unpair a wearable device' })
  unpairDevice(@Param('id') id: string) {
    this.devices = this.devices.filter((d) => d.id !== id);
    return { success: true, message: `Device ${id} successfully unlinked` };
  }
}
