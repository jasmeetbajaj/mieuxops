import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Like } from 'typeorm';
import { Project } from './entities/project.entity';
import { Task } from '../tasks/entities/task.entity';
import { ActivityLog } from '../activity-logs/entities/activity-log.entity';
import { ProjectStatus } from '../common/enums';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectsRepo: Repository<Project>,
    @InjectRepository(Task) private tasksRepo: Repository<Task>,
    @InjectRepository(ActivityLog) private logsRepo: Repository<ActivityLog>,
  ) {}

  async findAll(query?: any) {
    const where: any = {};
    if (query?.status) where.status = query.status;
    if (query?.category) where.category = query.category;
    if (query?.priority) where.priority = query.priority;
    return this.projectsRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const project = await this.projectsRepo.findOne({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async create(data: Partial<Project>, actorId?: string) {
    const project = this.projectsRepo.create(data);
    const saved = await this.projectsRepo.save(project);
    await this.log(actorId, 'project.created', 'project', saved.id, `Project "${saved.name}" created`);
    return saved;
  }

  async update(id: string, data: Partial<Project>, actorId?: string) {
    const old = await this.findOne(id);
    await this.projectsRepo.update(id, data);
    await this.log(actorId, 'project.updated', 'project', id, `Project updated`, old as any, data as any);
    return this.findOne(id);
  }

  async updateStatus(id: string, status: ProjectStatus, actorId?: string) {
    if (status === ProjectStatus.DELIVERED) {
      const project = await this.findOne(id);
      if (project.qcStatus !== 'approved') {
        throw new Error('Cannot deliver project: QC not approved');
      }
    }
    await this.projectsRepo.update(id, { status });
    await this.log(actorId, 'project.status_changed', 'project', id, `Status changed to ${status}`);
    return this.findOne(id);
  }

  async getStats() {
    const [total, active, delivered, delayed] = await Promise.all([
      this.projectsRepo.count(),
      this.projectsRepo.count({ where: { status: ProjectStatus.ACTIVE } }),
      this.projectsRepo.count({ where: { status: ProjectStatus.DELIVERED } }),
      this.projectsRepo.createQueryBuilder('p')
        .where('p.slaDeadline < NOW() AND p.status NOT IN (:...done)', { done: ['delivered', 'closed'] })
        .getCount(),
    ]);
    return { total, active, delivered, delayed, onHold: total - active - delivered - delayed };
  }

  async getTasksByProject(projectId: string) {
    return this.tasksRepo.find({ where: { projectId }, order: { position: 'ASC' } });
  }

  private async log(actorId: string | undefined, action: string, type: string, id: string, desc: string, old?: any, newVals?: any) {
    await this.logsRepo.save(this.logsRepo.create({ actorId, action, entityType: type, entityId: id, description: desc, oldValues: old, newValues: newVals }));
  }
}
