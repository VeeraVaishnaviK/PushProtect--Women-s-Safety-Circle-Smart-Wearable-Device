export interface UserDocument {
    id: string;
    displayName: string;
    phone: string;
    email: string;
    passwordHash: string;
    emergencyMedicalInfo?: string;
    onboardingCompleted: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface DeviceDocument {
    id: string;
    ownerId: string;
    deviceIdentifier: string;
    name: string;
    hardwareModel: string;
    pairingStatus: 'connected' | 'disconnected' | 'unpaired';
    batteryLevel?: number;
    firmwareVersion: string;
    lastSeenAt: string;
    revokedAt?: string;
    isSimulated?: boolean;
}
export interface TrustedContactDocument {
    id: string;
    ownerId: string;
    name: string;
    phone: string;
    relationship: string;
    escalationPriority: 1 | 2 | 3;
    verified: boolean;
    invitationStatus: 'accepted' | 'pending' | 'revoked';
    notificationPreferences: {
        sms: boolean;
        push: boolean;
        calls: boolean;
    };
    consentTimestamps: {
        invitedAt: string;
        acceptedAt?: string;
    };
}
export interface JourneyDocument {
    id: string;
    userId: string;
    origin: string;
    destination: string;
    expectedArrivalTime: string;
    checkInIntervalMinutes: number;
    status: 'idle' | 'active' | 'missed_checkin' | 'escalated' | 'completed';
    startedAt?: string;
    lastCheckInAt?: string;
    nextCheckInDueAt?: string;
    endedAt?: string;
}
