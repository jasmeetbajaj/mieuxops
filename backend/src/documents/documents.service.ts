import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { ActivityLog } from '../activity-logs/entities/activity-log.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document) private docsRepo: Repository<Document>,
    @InjectRepository(ActivityLog) private logsRepo: Repository<ActivityLog>,
  ) {}

  async create(data: Partial<Document>, actorId?: string) {
    const doc = this.docsRepo.create({ ...data, uploadedById: actorId });
    const saved = await this.docsRepo.save(doc);
    await this.logsRepo.save(this.logsRepo.create({
      actorId,
      action: 'document.uploaded',
      entityType: 'document',
      entityId: saved.id,
      description: `Document "${saved.originalName}" uploaded`
    }));
    return saved;
  }

  async findAll(query?: any) {
    const where: any = {};
    if (query?.projectId) where.projectId = query.projectId;
    if (query?.taskId) where.taskId = query.taskId;
    if (query?.orderId) where.orderId = query.orderId;
    return this.docsRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const doc = await this.docsRepo.findOne({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async delete(id: string, actorId?: string) {
    const doc = await this.findOne(id);
    await this.docsRepo.delete(id);
    await this.logsRepo.save(this.logsRepo.create({
      actorId,
      action: 'document.deleted',
      entityType: 'document',
      entityId: id,
      description: `Document "${doc.originalName}" deleted`
    }));
    return { message: 'Document deleted' };
  }
}
