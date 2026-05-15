import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VmDeployment } from './entities/vm-deployment.entity';
import { ActivityLog } from '../activity-logs/entities/activity-log.entity';

@Injectable()
export class VmDeploymentsService {
  constructor(
    @InjectRepository(VmDeployment) private vmRepo: Repository<VmDeployment>,
    @InjectRepository(ActivityLog) private logsRepo: Repository<ActivityLog>,
  ) {}

  async create(data: Partial<VmDeployment>, actorId?: string) {
    const vm = this.vmRepo.create(data);
    const saved = await this.vmRepo.save(vm);
    await this.logsRepo.save(this.logsRepo.create({ actorId, action: 'vm.created', entityType: 'vm_deployment', entityId: saved.id, description: `VM "${saved.vmName}" deployed` }));
    return saved;
  }

  async findAll(query?: any) {
    const where: any = {};
    if (query?.projectId) where.projectId = query.projectId;
    if (query?.environment) where.environment = query.environment;
    return this.vmRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    return this.vmRepo.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<VmDeployment>, actorId?: string) {
    await this.vmRepo.update(id, data);
    return this.findOne(id);
  }

  async delete(id: string) {
    await this.vmRepo.delete(id);
    return { message: 'VM deployment record deleted' };
  }
}
