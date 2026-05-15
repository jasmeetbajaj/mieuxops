import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { Project } from '../projects/entities/project.entity';
import { Task } from '../tasks/entities/task.entity';
import { ActivityLog } from '../activity-logs/entities/activity-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Project, Task, ActivityLog])],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
