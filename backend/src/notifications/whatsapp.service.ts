import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private twilioClient: Twilio;

  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    
    // Only initialize if we actually have credentials, to prevent crashes on startup without env vars
    if (accountSid && authToken) {
      this.twilioClient = new Twilio(accountSid, authToken);
    }
  }

  async sendWhatsapp(to: string, message: string) {
    if (this.configService.get<string>('ENABLE_WHATSAPP_NOTIFICATIONS') !== 'true') {
      this.logger.log(`WhatsApp notifications disabled. Would have sent: [${message}] to ${to}`);
      return;
    }

    if (!this.twilioClient) {
      this.logger.warn('Twilio client is not initialized. Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN');
      return;
    }

    try {
      const fromNumber = this.configService.get<string>('TWILIO_WHATSAPP_FROM');
      // Twilio requires numbers to be prefixed with 'whatsapp:'
      const toPhone = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
      
      await this.twilioClient.messages.create({
        body: `*MieuxFlow Alert*\n\n${message}`,
        from: fromNumber || 'whatsapp:+14155238886', // Twilio sandbox default
        to: toPhone,
      });
      
      this.logger.log(`WhatsApp message sent successfully to ${toPhone}`);
    } catch (error) {
      this.logger.error(`Failed to send WhatsApp message to ${to}`, error.stack);
    }
  }
}
