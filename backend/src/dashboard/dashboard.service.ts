import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
import { Task } from '../tasks/entities/task.entity';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { AuditRecord } from '../audit/entities/audit-record.entity';
import { QcRecord } from '../qc/entities/qc-record.entity';
import { ProjectStatus, TaskStatus, AuditStatus, QcStatus } from '../common/enums';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Project) private projectsRepo: Repository<Project>,
    @InjectRepository(Task) private tasksRepo: Repository<Task>,
    @InjectRepository(Order) private ordersRepo: Repository<Order>,
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(AuditRecord) private auditRepo: Repository<AuditRecord>,
    @InjectRepository(QcRecord) private qcRepo: Repository<QcRecord>,
  ) {}

  async getExecutiveSummary() {
    const [
      totalProjects, activeProjects, deliveredProjects, onHoldProjects,
      totalOrders, totalUsers, totalTasks, completedTasks,
      auditPassed, auditFailed, qcApproved, qcRejected,
      slaBreached,
    ] = await Promise.all([
      this.projectsRepo.count(),
      this.projectsRepo.count({ where: { status: ProjectStatus.ACTIVE } }),
      this.projectsRepo.count({ where: { status: ProjectStatus.DELIVERED } }),
      this.projectsRepo.count({ where: { status: ProjectStatus.ON_HOLD } }),
      this.ordersRepo.count(),
      this.usersRepo.count({ where: { isActive: true } }),
      this.tasksRepo.count(),
      this.tasksRepo.count({ where: { status: TaskStatus.COMPLETED } }),
      this.auditRepo.count({ where: { status: AuditStatus.PASSED } }),
      this.auditRepo.count({ where: { status: AuditStatus.FAILED } }),
      this.qcRepo.count({ where: { status: QcStatus.APPROVED } }),
      this.qcRepo.count({ where: { status: QcStatus.REJECTED } }),
      this.projectsRepo.count({ where: { slaBreached: true } }),
    ]);

    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      projects: { total: totalProjects, active: activeProjects, delivered: deliveredProjects, onHold: onHoldProjects },
      orders: { total: totalOrders },
      users: { active: totalUsers },
      tasks: { total: totalTasks, completed: completedTasks, completionRate: taskCompletionRate },
      audit: { passed: auditPassed, failed: auditFailed },
      qc: { approved: qcApproved, rejected: qcRejected },
      sla: { breached: slaBreached },
    };
  }

  async getProjectsByStatus() {
    const statuses = Object.values(ProjectStatus);
    const result = await Promise.all(
      statuses.map(async (status) => ({
        status,
        count: await this.projectsRepo.count({ where: { status } }),
      }))
    );
    return result;
  }

  async getProjectsByCategory() {
    return this.projectsRepo
      .createQueryBuilder('p')
      .select('p.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('p.category')
      .getRawMany();
  }

  async getEngineerWorkload() {
    return this.tasksRepo
      .createQueryBuilder('t')
      .select('t.assignedToId', 'userId')
      .addSelect('COUNT(*)', 'taskCount')
      .where('t.status NOT IN (:...done)', { done: ['completed', 'closed'] })
      .groupBy('t.assignedToId')
      .getRawMany();
  }

  async getDepartmentPerformance() {
    return this.tasksRepo
      .createQueryBuilder('t')
      .select('t.department', 'department')
      .addSelect('COUNT(*)', 'total')
      .addSelect('SUM(CASE WHEN t.status = :completed THEN 1 ELSE 0 END)', 'completed')
      .setParameter('completed', 'completed')
      .groupBy('t.department')
      .getRawMany();
  }

  async getRecentProjects(limit = 10) {
    return this.projectsRepo.find({ order: { createdAt: 'DESC' }, take: limit });
  }

  async getSlaReport() {
    const total = await this.projectsRepo.count();
    const breached = await this.projectsRepo.count({ where: { slaBreached: true } });
    const compliant = total - breached;
    const complianceRate = total > 0 ? Math.round((compliant / total) * 100) : 100;
    return { total, breached, compliant, complianceRate };
  }

  async getMonthlyDelivery() {
    return this.projectsRepo
      .createQueryBuilder('p')
      .select("TO_CHAR(p.createdAt, 'YYYY-MM')", 'month')
      .addSelect('COUNT(*)', 'total')
      .addSelect("SUM(CASE WHEN p.status = 'delivered' THEN 1 ELSE 0 END)", 'delivered')
      .groupBy("TO_CHAR(p.createdAt, 'YYYY-MM')")
      .orderBy("TO_CHAR(p.createdAt, 'YYYY-MM')", 'DESC')
      .take(12)
      .getRawMany();
  }
}
