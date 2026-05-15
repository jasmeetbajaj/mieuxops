import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/project.entity';
import { Task } from '../tasks/entities/task.entity';
import { ActivityLog } from '../activity-logs/entities/activity-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Task, ActivityLog])],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [ProjectsService],
})
export class ProjectsModule {}
