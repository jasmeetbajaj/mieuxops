import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditRecord } from './entities/audit-record.entity';
import { Project } from '../projects/entities/project.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { ActivityLog } from '../activity-logs/entities/activity-log.entity';
import { AuditStatus, NotificationType } from '../common/enums';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditRecord) private auditRepo: Repository<AuditRecord>,
    @InjectRepository(Project) private projectsRepo: Repository<Project>,
    @InjectRepository(Notification) private notifRepo: Repository<Notification>,
    @InjectRepository(ActivityLog) private logsRepo: Repository<ActivityLog>,
  ) {}

  private calculateScores(record: Partial<AuditRecord>) {
    const checks = ['cpuRamVerified','osVerified','ipValidated','firewallRules','backupStatus','antivirusStatus','monitoringStatus','sslValidated','tsPlusValidated','updateStatus','patchStatus','securityHardening','passwordPolicy','documentationValidated'];
    const passed = checks.filter(c => record[c] === true).length;
    const total = checks.length;
    const complianceScore = Math.round((passed / total) * 100);
    const riskScore = 100 - complianceScore;
    return { complianceScore, riskScore };
  }

  async create(data: Partial<AuditRecord>, actorId?: string) {
    const scores = this.calculateScores(data);
    const record = this.auditRepo.create({ ...data, ...scores, auditorId: actorId });
    const saved = await this.auditRepo.save(record);
    await this.projectsRepo.update(data.projectId as string, { auditStatus: AuditStatus.IN_REVIEW });
    return saved;
  }

  async approve(id: string, remarks: string, actorId?: string) {
    const record = await this.auditRepo.findOne({ where: { id } });
    if (!record) throw new NotFoundException('Audit record not found');
    record.status = AuditStatus.PASSED;
    record.auditorRemarks = remarks;
    record.auditedAt = new Date();
    await this.auditRepo.save(record);
    await this.projectsRepo.update(record.projectId, { auditStatus: AuditStatus.PASSED });
    await this.log(actorId, 'audit.approved', id, 'Audit approved');
    return record;
  }

  async reject(id: string, remarks: string, actorId?: string) {
    const record = await this.auditRepo.findOne({ where: { id } });
    if (!record) throw new NotFoundException('Audit record not found');
    record.status = AuditStatus.FAILED;
    record.auditorRemarks = remarks;
    record.auditedAt = new Date();
    await this.auditRepo.save(record);
    await this.projectsRepo.update(record.projectId, { auditStatus: AuditStatus.FAILED });
    await this.log(actorId, 'audit.rejected', id, 'Audit rejected');
    return record;
  }

  async findAll(query?: any) {
    const where: any = {};
    if (query?.projectId) where.projectId = query.projectId;
    if (query?.status) where.status = query.status;
    return this.auditRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const record = await this.auditRepo.findOne({ where: { id } });
    if (!record) throw new NotFoundException('Audit record not found');
    return record;
  }

  async update(id: string, data: Partial<AuditRecord>) {
    const scores = this.calculateScores(data);
    await this.auditRepo.update(id, { ...data, ...scores });
    return this.findOne(id);
  }

  private async log(actorId: string | undefined, action: string, id: string, desc: string) {
    await this.logsRepo.save(this.logsRepo.create({ actorId, action, entityType: 'audit', entityId: id, description: desc }));
  }
}
