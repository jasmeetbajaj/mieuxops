import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './entities/activity-log.entity';

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectRepository(ActivityLog) private logsRepo: Repository<ActivityLog>,
  ) {}

  async findAll(query?: any) {
    const qb = this.logsRepo.createQueryBuilder('log');
    if (query?.actorId) qb.andWhere('log.actorId = :actorId', { actorId: query.actorId });
    if (query?.entityType) qb.andWhere('log.entityType = :entityType', { entityType: query.entityType });
    if (query?.entityId) qb.andWhere('log.entityId = :entityId', { entityId: query.entityId });
    if (query?.from) qb.andWhere('log.createdAt >= :from', { from: query.from });
    if (query?.to) qb.andWhere('log.createdAt <= :to', { to: query.to });
    if (query?.search) qb.andWhere('log.description ILIKE :search', { search: `%${query.search}%` });
    qb.orderBy('log.createdAt', 'DESC').take(query?.limit || 100);
    return qb.getMany();
  }

  async log(data: Partial<ActivityLog>) {
    const entry = this.logsRepo.create(data);
    return this.logsRepo.save(entry);
  }

  // 90-day retention cleanup — called by scheduler
  async purgeOldLogs() {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);
    const result = await this.logsRepo.createQueryBuilder()
      .delete()
      .where('createdAt < :cutoff', { cutoff })
      .execute();
    return { deleted: result.affected };
  }
}
