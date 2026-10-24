"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let DevicesController = class DevicesController {
    constructor() {
        this.devices = [
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
    }
    pairDevice(body) {
        const newDevice = {
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
    getDevices() {
        return this.devices;
    }
    unpairDevice(id) {
        this.devices = this.devices.filter((d) => d.id !== id);
        return { success: true, message: `Device ${id} successfully unlinked` };
    }
};
exports.DevicesController = DevicesController;
__decorate([
    (0, common_1.Post)('pair'),
    (0, swagger_1.ApiOperation)({ summary: 'Pair and authenticate an ESP32 BLE wearable' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DevicesController.prototype, "pairDevice", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all paired wearable devices for authenticated owner' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DevicesController.prototype, "getDevices", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Revoke and unpair a wearable device' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DevicesController.prototype, "unpairDevice", null);
exports.DevicesController = DevicesController = __decorate([
    (0, swagger_1.ApiTags)('Wearable Hardware'),
    (0, common_1.Controller)('api/v1/devices')
], DevicesController);
//# sourceMappingURL=devices.controller.js.map