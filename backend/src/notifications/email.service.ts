import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail(to: string, subject: string, body: string) {
    if (this.configService.get<string>('ENABLE_EMAIL_NOTIFICATIONS') !== 'true') {
      this.logger.log(`Email notifications disabled. Would have sent: [${subject}] to ${to}`);
      return;
    }

    try {
      await this.mailerService.sendMail({
        to,
        subject,
        text: body,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
            <h2 style="color: #3b82f6;">MieuxFlow Enterprise</h2>
            <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 15px 0;"/>
            <p style="color: #333; line-height: 1.6;">${body.replace(/\n/g, '<br/>')}</p>
            <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;"/>
            <p style="font-size: 12px; color: #888;">Automated message from MieuxFlow Operational Command Center.</p>
          </div>
        `,
      });
      this.logger.log(`Email sent successfully to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error.stack);
    }
  }
}
