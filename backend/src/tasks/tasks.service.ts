import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { ActivityLog } from '../activity-logs/entities/activity-log.entity';
import { TaskStatus, NotificationType } from '../common/enums';
import { addHours } from 'date-fns';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasksRepo: Repository<Task>,
    @InjectRepository(Notification) private notifRepo: Repository<Notification>,
    @InjectRepository(ActivityLog) private logsRepo: Repository<ActivityLog>,
  ) {}

  private parseTat(tat: string): number {
    if (!tat) return 0;
    const match = tat.match(/^(\d+)h$/);
    return match ? parseInt(match[1]) : 0;
  }

  async create(data: Partial<Task>, actorId?: string) {
    const task = this.tasksRepo.create(data);
    if (data.slaDuration) {
      task.startedAt = new Date();
      task.slaDeadline = addHours(new Date(), this.parseTat(data.slaDuration));
    }
    const saved = await this.tasksRepo.save(task);

    // Notify assigned user
    if (saved.assignedToId) {
      await this.notifRepo.save(this.notifRepo.create({
        userId: saved.assignedToId,
        type: NotificationType.TASK_ASSIGNED,
        title: 'New Task Assigned',
        message: `You have been assigned task: ${saved.title}`,
        relatedEntityId: saved.id,
        relatedEntityType: 'task',
      }));
    }
    await this.log(actorId, 'task.created', saved.id, `Task "${saved.title}" created`);
    return saved;
  }

  async findAll(query?: any) {
    const where: any = {};
    if (query?.projectId) where.projectId = query.projectId;
    if (query?.status) where.status = query.status;
    if (query?.assignedToId) where.assignedToId = query.assignedToId;
    if (query?.department) where.department = query.department;
    return this.tasksRepo.find({ where, order: { position: 'ASC', createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const task = await this.tasksRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, data: Partial<Task>, actorId?: string) {
    const old = await this.findOne(id);
    if (data.status === TaskStatus.COMPLETED && !old.completedAt) {
      data.completedAt = new Date();
    }
    if (data.status === TaskStatus.IN_PROGRESS && !old.startedAt) {
      data.startedAt = new Date();
    }
    await this.tasksRepo.update(id, data);
    await this.log(actorId, 'task.updated', id, `Task status: ${data.status || 'updated'}`, old as any, data as any);
    return this.findOne(id);
  }

  async updateKanbanPosition(id: string, column: string, position: number, actorId?: string) {
    await this.tasksRepo.update(id, { kanbanColumn: column, position });
    return this.findOne(id);
  }

  async getKanbanBoard(projectId: string) {
    const tasks = await this.tasksRepo.find({ where: { projectId }, order: { position: 'ASC' } });
    const columns = {
      todo: tasks.filter(t => t.kanbanColumn === 'todo' || (!t.kanbanColumn && t.status === TaskStatus.PENDING)),
      assigned: tasks.filter(t => t.kanbanColumn === 'assigned' || t.status === TaskStatus.ASSIGNED),
      in_progress: tasks.filter(t => t.kanbanColumn === 'in_progress' || t.status === TaskStatus.IN_PROGRESS),
      audit: tasks.filter(t => t.kanbanColumn === 'audit' || t.status === TaskStatus.AUDIT_PENDING),
      qc: tasks.filter(t => t.kanbanColumn === 'qc' || t.status === TaskStatus.QC_PENDING),
      completed: tasks.filter(t => t.kanbanColumn === 'completed' || t.status === TaskStatus.COMPLETED),
    };
    return columns;
  }

  async delete(id: string) {
    await this.tasksRepo.delete(id);
    return { message: 'Task deleted' };
  }

  private async log(actorId: string | undefined, action: string, id: string, desc: string, old?: any, newVals?: any) {
    await this.logsRepo.save(this.logsRepo.create({ actorId, action, entityType: 'task', entityId: id, description: desc, oldValues: old, newValues: newVals }));
  }
}
