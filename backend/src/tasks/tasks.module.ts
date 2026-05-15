import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { ActivityLog } from '../activity-logs/entities/activity-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Notification, ActivityLog])],
  providers: [TasksService],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule {}
