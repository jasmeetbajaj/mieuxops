import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User } from '../users/entities/user.entity';
import { NotificationType } from '../common/enums';
import { EmailService } from './email.service';
import { WhatsappService } from './whatsapp.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification) private notifRepo: Repository<Notification>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private emailService: EmailService,
    private whatsappService: WhatsappService,
  ) {}

  async getUserNotifications(userId: string, onlyUnread = false) {
    const where: any = { userId };
    if (onlyUnread) where.isRead = false;
    return this.notifRepo.find({ where, order: { createdAt: 'DESC' }, take: 50 });
  }

  async markRead(id: string) {
    await this.notifRepo.update(id, { isRead: true });
    return { success: true };
  }

  async markAllRead(userId: string) {
    await this.notifRepo.update({ userId, isRead: false }, { isRead: true });
    return { success: true };
  }

  async create(data: Partial<Notification>) {
    const notif = this.notifRepo.create(data);
    const savedNotif = await this.notifRepo.save(notif);

    try {
      if (data.userId) {
        const user = await this.userRepo.findOne({ where: { id: data.userId } });
        if (user) {
          // Fire and forget Email
          if (user.email) {
            this.emailService.sendEmail(
              user.email,
              data.title || 'MieuxFlow Alert',
              data.message || 'You have a new notification.'
            ).catch(e => this.logger.error('Email dispatch error', e));
          }
          
          // Fire and forget WhatsApp
          // Note: In reality, you'd have a phone field on User. Assuming 'phone' exists or gracefully fails.
          if ((user as any).phone) {
            this.whatsappService.sendWhatsapp(
              (user as any).phone,
              `*${data.title}*\n${data.message}`
            ).catch(e => this.logger.error('WhatsApp dispatch error', e));
          }
        }
      }
    } catch (e) {
      this.logger.error('Failed to trigger external notifications', e);
    }

    return savedNotif;
  }

  async getUnreadCount(userId: string) {
    const count = await this.notifRepo.count({ where: { userId, isRead: false } });
    return { count };
  }

  async delete(id: string) {
    await this.notifRepo.delete(id);
    return { success: true };
  }
}
