import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { AuditRecord } from './entities/audit-record.entity';
import { Project } from '../projects/entities/project.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { ActivityLog } from '../activity-logs/entities/activity-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditRecord, Project, Notification, ActivityLog])],
  providers: [AuditService],
  controllers: [AuditController],
  exports: [AuditService],
})
export class AuditModule {}
