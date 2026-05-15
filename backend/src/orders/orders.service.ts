import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Project } from '../projects/entities/project.entity';
import { Task } from '../tasks/entities/task.entity';
import { ActivityLog } from '../activity-logs/entities/activity-log.entity';
import { format } from 'date-fns';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepo: Repository<Order>,
    @InjectRepository(Project) private projectsRepo: Repository<Project>,
    @InjectRepository(Task) private tasksRepo: Repository<Task>,
    @InjectRepository(ActivityLog) private logsRepo: Repository<ActivityLog>,
  ) {}

  private async generateId(prefix: string, repo: Repository<any>, field: string) {
    const ym = format(new Date(), 'yyyyMM');
    const count = await repo.count();
    const seq = String(count + 1).padStart(4, '0');
    return `${prefix}-${ym}-${seq}`;
  }

  async create(data: Partial<Order>, actorId?: string) {
    const orderId = await this.generateId('ORD', this.ordersRepo, 'orderId');
    const ticketId = orderId.replace('ORD', 'TKT');
    const projectId = orderId.replace('ORD', 'PRJ');

    const order = this.ordersRepo.create({
      ...data,
      orderId,
      ticketId,
      projectId,
      createdById: actorId,
      status: 'new',
    });
    const saved = await this.ordersRepo.save(order);

    // Auto-create project
    const project = this.projectsRepo.create({
      name: `${data.customerName} - ${data.projectType}`,
      orderId: saved.id,
      orderRef: orderId,
      category: data.projectCategory as any,
      priority: data.priority as any,
      customerName: data.customerName,
      companyName: data.companyName,
      environment: data.environment as any,
      startDate: data.startDate,
      dueDate: data.deliveryDate,
      slaTat: data.slaTat,
      assignedOwnerId: data.deploymentOwner,
      status: 'active' as any,
    });
    const savedProject = await this.projectsRepo.save(project);

    // Link order to project
    await this.ordersRepo.update(saved.id, { projectIdRef: savedProject.id });

    // Log
    await this.logsRepo.save(
      this.logsRepo.create({
        actorId,
        action: 'order.created',
        entityType: 'order',
        entityId: saved.id,
        description: `Order ${orderId} created for ${data.customerName}`,
      }),
    );

    return { order: saved, project: savedProject };
  }

  async findAll(query?: { status?: string; category?: string; customerId?: string }) {
    const where: any = {};
    if (query?.status) where.status = query.status;
    if (query?.category) where.projectCategory = query.category;
    return this.ordersRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const order = await this.ordersRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async update(id: string, data: Partial<Order>, actorId?: string) {
    await this.ordersRepo.update(id, data);
    await this.logsRepo.save(
      this.logsRepo.create({
        actorId,
        action: 'order.updated',
        entityType: 'order',
        entityId: id,
        newValues: data as any,
        description: `Order ${id} updated`,
      }),
    );
    return this.findOne(id);
  }

  async delete(id: string) {
    await this.ordersRepo.softDelete(id);
    return { message: 'Order deleted' };
  }
}
