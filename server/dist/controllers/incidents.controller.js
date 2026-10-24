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
exports.IncidentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const incidents_service_1 = require("../services/incidents.service");
let IncidentsController = class IncidentsController {
    constructor(incidentsService) {
        this.incidentsService = incidentsService;
    }
    createIncident(body) {
        return this.incidentsService.createIncident(body);
    }
    getIncidents() {
        return this.incidentsService.getIncidents();
    }
    getIncidentById(id) {
        return this.incidentsService.getIncidentById(id);
    }
    getIncidentTimeline(id) {
        const inc = this.incidentsService.getIncidentById(id);
        return inc.timeline;
    }
    acknowledgeIncident(id, body) {
        return this.incidentsService.acknowledgeIncident(id, body.contactId);
    }
    updateLocation(id, body) {
        return this.incidentsService.updateLocation(id, body);
    }
    cancelIncident(id) {
        return this.incidentsService.cancelIncident(id);
    }
    resolveIncident(id, body) {
        return this.incidentsService.resolveIncident(id, body.notes);
    }
};
exports.IncidentsController = IncidentsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Trigger new SOS emergency incident (Idempotent)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Emergency incident registered and queued' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Duplicate event ID rejected (Replay protection)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], IncidentsController.prototype, "createIncident", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List emergency incident records' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], IncidentsController.prototype, "getIncidents", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active incident details by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Incident ID, e.g. INC-102948' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], IncidentsController.prototype, "getIncidentById", null);
__decorate([
    (0, common_1.Get)(':id/timeline'),
    (0, swagger_1.ApiOperation)({ summary: 'Get chronological audit timeline of an incident' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IncidentsController.prototype, "getIncidentTimeline", null);
__decorate([
    (0, common_1.Post)(':id/acknowledgements'),
    (0, swagger_1.ApiOperation)({ summary: 'Trusted contact confirms acknowledgement of emergency alert' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Object)
], IncidentsController.prototype, "acknowledgeIncident", null);
__decorate([
    (0, common_1.Post)(':id/locations'),
    (0, swagger_1.ApiOperation)({ summary: 'Push refined GPS coordinates to an active incident' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Object)
], IncidentsController.prototype, "updateLocation", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel false alarm incident' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], IncidentsController.prototype, "cancelIncident", null);
__decorate([
    (0, common_1.Post)(':id/resolve'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve incident safely with optional confirmation note' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Object)
], IncidentsController.prototype, "resolveIncident", null);
exports.IncidentsController = IncidentsController = __decorate([
    (0, swagger_1.ApiTags)('Emergency Incidents'),
    (0, common_1.Controller)('api/v1/incidents'),
    __metadata("design:paramtypes", [incidents_service_1.IncidentsService])
], IncidentsController);
//# sourceMappingURL=incidents.controller.js.map