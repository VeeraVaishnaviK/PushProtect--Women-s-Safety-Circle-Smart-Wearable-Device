import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TrustedContactDocument } from '../schemas/domain.schemas';

@ApiTags('Trusted Circle Contacts')
@Controller('api/v1/contacts')
export class ContactsController {
  private contacts: TrustedContactDocument[] = [
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

  @Post('invitations')
  @ApiOperation({ summary: 'Send invitation to add a trusted contact to safety circle' })
  inviteContact(@Body() body: any) {
    const contact: TrustedContactDocument = {
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

  @Get()
  @ApiOperation({ summary: 'List all verified trusted contacts for current user' })
  getContacts() {
    return this.contacts;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update contact details or change escalation priority tier' })
  updateContact(@Param('id') id: string, @Body() body: any) {
    this.contacts = this.contacts.map((c) => (c.id === id ? { ...c, ...body } : c));
    return this.contacts.find((c) => c.id === id);
  }
}
