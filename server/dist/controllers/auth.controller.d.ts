export declare class AuthController {
    register(body: any): {
        success: boolean;
        user: {
            id: string;
            displayName: any;
            phone: any;
            email: any;
            onboardingCompleted: boolean;
        };
        token: string;
    };
    login(body: any): {
        success: boolean;
        user: {
            id: string;
            displayName: string;
            phone: any;
            email: string;
            onboardingCompleted: boolean;
        };
        token: string;
    };
    getProfile(): {
        id: string;
        displayName: string;
        phone: string;
        email: string;
        emergencyMedicalInfo: string;
        onboardingCompleted: boolean;
    };
}
