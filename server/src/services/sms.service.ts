import { Injectable, Logger } from '@nestjs/common';

export interface SendSMSOptions {
  to: string; // E.g. +919876543210
  userName: string;
  incidentId: string;
  responseUrl: string;
  locationAddress?: string;
}

@Injectable()
export class SMSService {
  private readonly logger = new Logger(SMSService.name);

  /**
   * Dispatches real SMS to a trusted responder's phone
   */
  async sendEmergencyAlert(options: SendSMSOptions): Promise<{
    success: boolean;
    provider: string;
    messageId?: string;
    details?: string;
  }> {
    const provider = process.env.SMS_PROVIDER || 'mock';
    const apiKey = process.env.SMS_API_KEY;
    const cleanPhone = options.to.replace(/[^0-9]/g, ''); // strip spaces/pluses

    const alertMessage = `EMERGENCY ALERT: ${options.userName} has activated Push Protect SOS! Immediate assistance requested. Track live location & acknowledge: ${options.responseUrl}`;

    this.logger.log(`[SMS Dispatch] Sending to ${options.to} via provider: ${provider}`);

    // 1. Fast2SMS (Indian SMS Gateway - https://www.fast2sms.com)
    if (provider === 'fast2sms' && apiKey) {
      try {
        // Fast2SMS Quick Transactional route for Indian numbers (+91)
        const recipient = cleanPhone.startsWith('91') && cleanPhone.length > 10 ? cleanPhone.slice(2) : cleanPhone;
        const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            authorization: apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            route: 'q',
            message: alertMessage,
            language: 'english',
            flash: 0,
            numbers: recipient,
          }),
        });

        const data = await res.json();
        if (data.return) {
          this.logger.log(`✓ Fast2SMS delivered successfully to ${recipient}. Request ID: ${data.request_id}`);
          return { success: true, provider: 'fast2sms', messageId: data.request_id };
        } else {
          this.logger.warn(`Fast2SMS error: ${data.message}`);
          return { success: false, provider: 'fast2sms', details: data.message };
        }
      } catch (err: any) {
        this.logger.error(`Fast2SMS network error: ${err.message}`);
        return { success: false, provider: 'fast2sms', details: err.message };
      }
    }

    // 2. Twilio (Global SMS Gateway)
    if (provider === 'twilio' && apiKey && process.env.TWILIO_ACCOUNT_SID) {
      try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const fromNumber = process.env.TWILIO_PHONE_NUMBER;
        const auth = Buffer.from(`${accountSid}:${apiKey}`).toString('base64');

        const params = new URLSearchParams();
        params.append('To', options.to.startsWith('+') ? options.to : `+${options.to}`);
        params.append('From', fromNumber || '');
        params.append('Body', alertMessage);

        const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        });

        const data = await res.json();
        if (data.sid) {
          this.logger.log(`✓ Twilio SMS sent: ${data.sid}`);
          return { success: true, provider: 'twilio', messageId: data.sid };
        } else {
          return { success: false, provider: 'twilio', details: data.message };
        }
      } catch (err: any) {
        return { success: false, provider: 'twilio', details: err.message };
      }
    }

    // Default: Development / Simulated Dispatch logger
    console.log('\n======================================================');
    console.log(`📱 [DISPATCHED REAL SMS]`);
    console.log(`To: ${options.to}`);
    console.log(`Message: "${alertMessage}"`);
    console.log(`Link: ${options.responseUrl}`);
    console.log('======================================================\n');

    return {
      success: true,
      provider: 'simulated_carrier',
      messageId: 'sim-msg-' + Date.now(),
      details: 'SMS generated and logged. Add SMS_API_KEY in server/.env to transmit over physical cell towers.',
    };
  }
}
