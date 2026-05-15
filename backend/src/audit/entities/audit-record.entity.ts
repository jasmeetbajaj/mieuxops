import { Entity, Column } from 'typeorm';
import { Base } from '../../common/entities/base.entity';
import { AuditStatus } from '../../common/enums';

@Entity('audit_records')
export class AuditRecord extends Base {
  @Column()
  projectId: string;

  @Column({ nullable: true })
  vmDeploymentId: string;

  @Column({ nullable: true })
  auditorId: string;

  @Column({
    type: 'enum',
    enum: AuditStatus,
    default: AuditStatus.PENDING,
  })
  status: AuditStatus;

  // Checklist items - each stored as boolean
  @Column({ nullable: true, type: 'boolean' })
  cpuRamVerified: boolean;
  @Column({ nullable: true, type: 'boolean' })
  osVerified: boolean;
  @Column({ nullable: true, type: 'boolean' })
  ipValidated: boolean;
  @Column({ nullable: true, type: 'boolean' })
  firewallRules: boolean;
  @Column({ nullable: true, type: 'boolean' })
  backupStatus: boolean;
  @Column({ nullable: true, type: 'boolean' })
  antivirusStatus: boolean;
  @Column({ nullable: true, type: 'boolean' })
  monitoringStatus: boolean;
  @Column({ nullable: true, type: 'boolean' })
  sslValidated: boolean;
  @Column({ nullable: true, type: 'boolean' })
  tsPlusValidated: boolean;
  @Column({ nullable: true, type: 'boolean' })
  updateStatus: boolean;
  @Column({ nullable: true, type: 'boolean' })
  patchStatus: boolean;
  @Column({ nullable: true, type: 'boolean' })
  securityHardening: boolean;
  @Column({ nullable: true, type: 'boolean' })
  passwordPolicy: boolean;
  @Column({ nullable: true, type: 'boolean' })
  documentationValidated: boolean;

  @Column({ nullable: true, type: 'decimal', precision: 5, scale: 2 })
  complianceScore: number;

  @Column({ nullable: true, type: 'decimal', precision: 5, scale: 2 })
  riskScore: number;

  @Column({ nullable: true, type: 'text' })
  engineerRemarks: string;

  @Column({ nullable: true, type: 'text' })
  auditorRemarks: string;

  @Column({ nullable: true, type: 'text' })
  observations: string;

  @Column({ nullable: true, type: 'timestamptz' })
  auditedAt: Date;
}
