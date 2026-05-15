import { Entity, Column, OneToMany } from 'typeorm';
import { Base } from '../../common/entities/base.entity';

@Entity('orders')
export class Order extends Base {
  @Column({ unique: true })
  orderId: string; // ORD-YYYYMM-NNNN

  @Column({ unique: true })
  ticketId: string; // TKT-YYYYMM-NNNN

  @Column({ unique: true })
  projectId: string; // PRJ-YYYYMM-NNNN

  @Column()
  customerName: string;

  @Column()
  companyName: string;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ nullable: true })
  contactPhone: string;

  @Column()
  projectType: string;

  @Column()
  projectCategory: string;

  @Column({ nullable: true, type: 'text' })
  deploymentScope: string;

  @Column({ nullable: true })
  billingType: string;

  @Column({ nullable: true, type: 'date' })
  startDate: Date;

  @Column({ nullable: true, type: 'date' })
  deliveryDate: Date;

  @Column({ default: 'medium' })
  priority: string;

  @Column({ nullable: true })
  slaTat: string; // e.g. "4h", "8h"

  @Column({ nullable: true })
  assignedTeams: string; // comma-separated departments

  @Column({ nullable: true })
  deploymentOwner: string;

  @Column({ nullable: true })
  environment: string; // demo/production

  @Column({ nullable: true, type: 'text' })
  environmentNotes: string;

  @Column({ nullable: true, type: 'text' })
  internalNotes: string;

  @Column({ default: 'new' })
  status: string;

  @Column({ nullable: true })
  createdById: string;

  @Column({ nullable: true })
  projectIdRef: string; // FK to projects table
}
