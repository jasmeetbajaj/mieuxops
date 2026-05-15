import { Entity, Column } from 'typeorm';
import { Base } from '../../common/entities/base.entity';
import { QcStatus } from '../../common/enums';

@Entity('qc_records')
export class QcRecord extends Base {
  @Column()
  projectId: string;

  @Column({ nullable: true })
  qcUserId: string;

  @Column({
    type: 'enum',
    enum: QcStatus,
    default: QcStatus.PENDING,
  })
  status: QcStatus;

  // QC Checklist
  @Column({ nullable: true, type: 'boolean' })
  serviceFunctionality: boolean;
  @Column({ nullable: true, type: 'boolean' })
  connectivity: boolean;
  @Column({ nullable: true, type: 'boolean' })
  monitoring: boolean;
  @Column({ nullable: true, type: 'boolean' })
  backupJobs: boolean;
  @Column({ nullable: true, type: 'boolean' })
  securityPolicies: boolean;
  @Column({ nullable: true, type: 'boolean' })
  userAccess: boolean;
  @Column({ nullable: true, type: 'boolean' })
  customerAcceptance: boolean;

  @Column({ nullable: true, type: 'text' })
  remarks: string;

  @Column({ nullable: true, type: 'text' })
  rejectionReason: string;

  @Column({ nullable: true })
  sentBackToDepartment: string;

  @Column({ nullable: true, type: 'timestamptz' })
  reviewedAt: Date;
}
