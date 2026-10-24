import { TrustedContactDocument } from '../schemas/domain.schemas';
export declare class ContactsController {
    private contacts;
    inviteContact(body: any): TrustedContactDocument;
    getContacts(): TrustedContactDocument[];
    updateContact(id: string, body: any): TrustedContactDocument;
}
