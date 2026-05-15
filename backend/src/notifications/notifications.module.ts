import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notification } from './entities/notification.entity';
import { User } from '../users/entities/user.entity';
import { EmailService } from './email.service';
import { WhatsappService } from './whatsapp.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, User]),
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('SMTP_HOST'),
          port: config.get('SMTP_PORT'),
          secure: config.get('SMTP_SECURE') === 'true',
          auth: {
            user: config.get('SMTP_USER'),
            pass: config.get('SMTP_PASS'),
          },
        },
        defaults: {
          from: `"MieuxFlow Enterprise" <${config.get('SMTP_FROM')}>`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [NotificationsService, EmailService, WhatsappService],
  controllers: [NotificationsController],
  exports: [NotificationsService, EmailService, WhatsappService],
})
export class NotificationsModule {}
