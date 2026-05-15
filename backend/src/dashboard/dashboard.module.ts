import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Project } from '../projects/entities/project.entity';
import { Task } from '../tasks/entities/task.entity';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { AuditRecord } from '../audit/entities/audit-record.entity';
import { QcRecord } from '../qc/entities/qc-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Task, Order, User, AuditRecord, QcRecord])],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
