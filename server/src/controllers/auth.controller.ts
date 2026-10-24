import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Authentication & Identity')
@Controller('api/v1')
export class AuthController {
  @Post('auth/register')
  @ApiOperation({ summary: 'Register a new user account with privacy consent settings' })
  register(@Body() body: any) {
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

  @Post('auth/login')
  @ApiOperation({ summary: 'Authenticate user and return secure session token' })
  login(@Body() body: any) {
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

  @Get('users/me')
  @ApiOperation({ summary: 'Get profile and emergency health details for current authenticated user' })
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
}
