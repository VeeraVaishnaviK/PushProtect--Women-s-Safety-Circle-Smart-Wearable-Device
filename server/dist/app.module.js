"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./controllers/auth.controller");
const devices_controller_1 = require("./controllers/devices.controller");
const contacts_controller_1 = require("./controllers/contacts.controller");
const incidents_controller_1 = require("./controllers/incidents.controller");
const journeys_controller_1 = require("./controllers/journeys.controller");
const incidents_service_1 = require("./services/incidents.service");
const events_gateway_1 = require("./events/events.gateway");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [
            auth_controller_1.AuthController,
            devices_controller_1.DevicesController,
            contacts_controller_1.ContactsController,
            incidents_controller_1.IncidentsController,
            journeys_controller_1.JourneysController,
        ],
        providers: [incidents_service_1.IncidentsService, events_gateway_1.EventsGateway],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map