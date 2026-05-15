import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Base } from '../../common/entities/base.entity';
import { ProjectStatus, ProjectCategory, Priority, EnvironmentType } from '../../common/enums';

@Entity('projects')
export class Project extends Base {
  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  orderId: string;

  @Column({ nullable: true })
  orderRef: string; // human-readable order ID

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE,
  })
  status: ProjectStatus;

  @Column({
    type: 'enum',
    enum: ProjectCategory,
    nullable: true,
  })
  category: ProjectCategory;

  @Column({
    type: 'enum',
    enum: Priority,
    default: Priority.MEDIUM,
  })
  priority: Priority;

  @Column({
    type: 'enum',
    enum: EnvironmentType,
    default: EnvironmentType.PRODUCTION,
  })
  environment: EnvironmentType;

  @Column({ nullable: true })
  customerId: string;

  @Column({ nullable: true })
  customerName: string;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  assignedOwnerId: string;

  @Column({ nullable: true, type: 'date' })
  startDate: Date;

  @Column({ nullable: true, type: 'date' })
  dueDate: Date;

  @Column({ nullable: true, type: 'date' })
  completedAt: Date;

  @Column({ nullable: true })
  slaTat: string;

  @Column({ nullable: true, type: 'timestamptz' })
  slaDeadline: Date;

  @Column({ default: false })
  slaBreached: boolean;

  @Column({ nullable: true, type: 'text' })
  internalNotes: string;

  @Column({ default: 0 })
  completionPercent: number;

  @Column({ nullable: true })
  auditStatus: string;

  @Column({ nullable: true })
  qcStatus: string;
}
