import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QcRecord } from './entities/qc-record.entity';
import { Project } from '../projects/entities/project.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { ActivityLog } from '../activity-logs/entities/activity-log.entity';
import { QcStatus, NotificationType, ProjectStatus } from '../common/enums';

@Injectable()
export class QcService {
  constructor(
    @InjectRepository(QcRecord) private qcRepo: Repository<QcRecord>,
    @InjectRepository(Project) private projectsRepo: Repository<Project>,
    @InjectRepository(Notification) private notifRepo: Repository<Notification>,
    @InjectRepository(ActivityLog) private logsRepo: Repository<ActivityLog>,
  ) {}

  async create(data: Partial<QcRecord>, actorId?: string) {
    const record = this.qcRepo.create({ ...data, qcUserId: actorId });
    const saved = await this.qcRepo.save(record);
    await this.projectsRepo.update(data.projectId as string, { qcStatus: QcStatus.IN_REVIEW });
    return saved;
  }

  async approve(id: string, remarks: string, actorId?: string) {
    const record = await this.qcRepo.findOne({ where: { id } });
    if (!record) throw new NotFoundException('QC record not found');
    record.status = QcStatus.APPROVED;
    record.remarks = remarks;
    record.reviewedAt = new Date();
    await this.qcRepo.save(record);
    await this.projectsRepo.update(record.projectId, { qcStatus: QcStatus.APPROVED, status: ProjectStatus.DELIVERED });
    await this.log(actorId, 'qc.approved', id, 'QC approved - project delivered');
    return record;
  }

  async reject(id: string, reason: string, actorId?: string) {
    const record = await this.qcRepo.findOne({ where: { id } });
    if (!record) throw new NotFoundException('QC record not found');
    record.status = QcStatus.REJECTED;
    record.rejectionReason = reason;
    record.reviewedAt = new Date();
    await this.qcRepo.save(record);
    await this.projectsRepo.update(record.projectId, { qcStatus: QcStatus.REJECTED });
    await this.log(actorId, 'qc.rejected', id, `QC rejected: ${reason}`);
    return record;
  }

  async sendBack(id: string, department: string, reason: string, actorId?: string) {
    const record = await this.qcRepo.findOne({ where: { id } });
    if (!record) throw new NotFoundException('QC record not found');
    record.status = QcStatus.SENT_BACK;
    record.sentBackToDepartment = department;
    record.rejectionReason = reason;
    await this.qcRepo.save(record);
    await this.projectsRepo.update(record.projectId, { qcStatus: QcStatus.SENT_BACK });
    await this.log(actorId, 'qc.sent_back', id, `QC sent back to ${department}: ${reason}`);
    return record;
  }

  async findAll(query?: any) {
    const where: any = {};
    if (query?.projectId) where.projectId = query.projectId;
    if (query?.status) where.status = query.status;
    return this.qcRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const record = await this.qcRepo.findOne({ where: { id } });
    if (!record) throw new NotFoundException('QC record not found');
    return record;
  }

  async update(id: string, data: Partial<QcRecord>) {
    await this.qcRepo.update(id, data);
    return this.findOne(id);
  }

  private async log(actorId: string | undefined, action: string, id: string, desc: string) {
    await this.logsRepo.save(this.logsRepo.create({ actorId, action, entityType: 'qc', entityId: id, description: desc }));
  }
}
