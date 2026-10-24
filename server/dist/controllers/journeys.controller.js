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
exports.JourneysController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let JourneysController = class JourneysController {
    constructor() {
        this.activeJourneys = new Map();
    }
    startJourney(body) {
        const id = 'sj-' + Date.now();
        const now = new Date();
        const duration = body.expectedArrivalMinutes || 30;
        const interval = body.checkInIntervalMinutes || 10;
        const journey = {
            id,
            userId: body.userId || 'usr-101',
            origin: body.origin || 'Current Location',
            destination: body.destination || 'Home Residence',
            expectedArrivalTime: new Date(now.getTime() + duration * 60000).toISOString(),
            checkInIntervalMinutes: interval,
            status: 'active',
            startedAt: now.toISOString(),
            lastCheckInAt: now.toISOString(),
            nextCheckInDueAt: new Date(now.getTime() + interval * 60000).toISOString(),
        };
        this.activeJourneys.set(id, journey);
        return journey;
    }
    checkIn(id) {
        const journey = this.activeJourneys.get(id);
        if (!journey) {
            throw new Error(`Journey ${id} not found`);
        }
        const now = new Date();
        journey.lastCheckInAt = now.toISOString();
        journey.nextCheckInDueAt = new Date(now.getTime() + journey.checkInIntervalMinutes * 60000).toISOString();
        journey.status = 'active';
        return journey;
    }
};
exports.JourneysController = JourneysController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate a new escorted Safe Journey with check-in schedule' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], JourneysController.prototype, "startJourney", null);
__decorate([
    (0, common_1.Post)(':id/check-in'),
    (0, swagger_1.ApiOperation)({ summary: 'User confirms safe arrival or routine check-in milestone' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], JourneysController.prototype, "checkIn", null);
exports.JourneysController = JourneysController = __decorate([
    (0, swagger_1.ApiTags)('Safe Journey Automated Escort'),
    (0, common_1.Controller)('api/v1/journeys')
], JourneysController);
//# sourceMappingURL=journeys.controller.js.map