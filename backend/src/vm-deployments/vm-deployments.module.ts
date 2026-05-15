import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VmDeploymentsService } from './vm-deployments.service';
import { VmDeploymentsController } from './vm-deployments.controller';
import { VmDeployment } from './entities/vm-deployment.entity';
import { ActivityLog } from '../activity-logs/entities/activity-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VmDeployment, ActivityLog])],
  providers: [VmDeploymentsService],
  controllers: [VmDeploymentsController],
  exports: [VmDeploymentsService],
})
export class VmDeploymentsModule {}
