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
exports.ContactsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let ContactsController = class ContactsController {
    constructor() {
        this.contacts = [
            {
                id: 'tc-1',
                ownerId: 'usr-101',
                name: 'Ananya Sharma',
                phone: '+91 98765 43210',
                relationship: 'Sister',
                escalationPriority: 1,
                verified: true,
                invitationStatus: 'accepted',
                notificationPreferences: { sms: true, push: true, calls: true },
                consentTimestamps: { invitedAt: '2026-05-10T10:00:00Z', acceptedAt: '2026-05-10T10:15:00Z' },
            },
            {
                id: 'tc-2',
                ownerId: 'usr-101',
                name: 'Dr. Priya Desai',
                phone: '+91 98111 22334',
                relationship: 'Mother',
                escalationPriority: 2,
                verified: true,
                invitationStatus: 'accepted',
                notificationPreferences: { sms: true, push: true, calls: false },
                consentTimestamps: { invitedAt: '2026-05-11T09:00:00Z', acceptedAt: '2026-05-11T09:30:00Z' },
            },
        ];
    }
    inviteContact(body) {
        const contact = {
            id: 'tc-' + Date.now(),
            ownerId: 'usr-101',
            name: body.name,
            phone: body.phone,
            relationship: body.relationship || 'Friend',
            escalationPriority: body.escalationPriority || 1,
            verified: true,
            invitationStatus: 'accepted',
            notificationPreferences: body.notificationPreferences || { sms: true, push: true, calls: false },
            consentTimestamps: { invitedAt: new Date().toISOString(), acceptedAt: new Date().toISOString() },
        };
        this.contacts.push(contact);
        return contact;
    }
    getContacts() {
        return this.contacts;
    }
    updateContact(id, body) {
        this.contacts = this.contacts.map((c) => (c.id === id ? { ...c, ...body } : c));
        return this.contacts.find((c) => c.id === id);
    }
};
exports.ContactsController = ContactsController;
__decorate([
    (0, common_1.Post)('invitations'),
    (0, swagger_1.ApiOperation)({ summary: 'Send invitation to add a trusted contact to safety circle' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "inviteContact", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all verified trusted contacts for current user' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "getContacts", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update contact details or change escalation priority tier' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "updateContact", null);
exports.ContactsController = ContactsController = __decorate([
    (0, swagger_1.ApiTags)('Trusted Circle Contacts'),
    (0, common_1.Controller)('api/v1/contacts')
], ContactsController);
//# sourceMappingURL=contacts.controller.js.map