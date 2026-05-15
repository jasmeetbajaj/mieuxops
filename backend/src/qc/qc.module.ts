import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QcService } from './qc.service';
import { QcController } from './qc.controller';
import { QcRecord } from './entities/qc-record.entity';
import { Project } from '../projects/entities/project.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { ActivityLog } from '../activity-logs/entities/activity-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QcRecord, Project, Notification, ActivityLog])],
  providers: [QcService],
  controllers: [QcController],
  exports: [QcService],
})
export class QcModule {}
