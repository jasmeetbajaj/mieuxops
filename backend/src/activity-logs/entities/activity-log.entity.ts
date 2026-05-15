import { Entity, Column } from 'typeorm';
import { Base } from '../../common/entities/base.entity';

@Entity('activity_logs')
export class ActivityLog extends Base {
  @Column({ nullable: true })
  actorId: string;

  @Column({ nullable: true })
  actorName: string;

  @Column()
  action: string; // e.g. 'task.status_changed', 'project.created'

  @Column({ nullable: true })
  entityType: string; // 'task', 'project', 'order' etc.

  @Column({ nullable: true })
  entityId: string;

  @Column({ nullable: true, type: 'jsonb' })
  oldValues: Record<string, any>;

  @Column({ nullable: true, type: 'jsonb' })
  newValues: Record<string, any>;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;
}
