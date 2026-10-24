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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    register(body) {
        return {
            success: true,
            user: {
                id: 'usr-' + Date.now(),
                displayName: body.displayName || 'Vaishnavi R.',
                phone: body.phone || '+91 98765 00000',
                email: body.email || 'vaishnavi@pushprotect.org',
                onboardingCompleted: true,
            },
            token: 'jwt-mock-pushprotect-' + Date.now(),
        };
    }
    login(body) {
        return {
            success: true,
            user: {
                id: 'usr-101',
                displayName: 'Vaishnavi R.',
                phone: body.phone || '+91 98765 00000',
                email: 'vaishnavi@pushprotect.org',
                onboardingCompleted: true,
            },
            token: 'jwt-mock-pushprotect-session',
        };
    }
    getProfile() {
        return {
            id: 'usr-101',
            displayName: 'Vaishnavi R.',
            phone: '+91 98765 00000',
            email: 'vaishnavi@pushprotect.org',
            emergencyMedicalInfo: 'Blood Group: O+ | No known allergies',
            onboardingCompleted: true,
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('auth/register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user account with privacy consent settings' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('auth/login'),
    (0, swagger_1.ApiOperation)({ summary: 'Authenticate user and return secure session token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('users/me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get profile and emergency health details for current authenticated user' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication & Identity'),
    (0, common_1.Controller)('api/v1')
], AuthController);
//# sourceMappingURL=auth.controller.js.map