import { Entity, Column } from 'typeorm';
import { Base } from '../../common/entities/base.entity';

@Entity('vm_deployments')
export class VmDeployment extends Base {
  // Customer Info
  @Column()
  customerName: string;
  @Column()
  projectName: string;
  @Column({ nullable: true })
  orderId: string;
  @Column({ nullable: true })
  projectId: string;
  @Column({ nullable: true })
  environment: string; // demo/production

  // VM Details
  @Column()
  vmName: string;
  @Column({ nullable: true })
  vmId: string;
  @Column({ nullable: true })
  hostName: string;
  @Column({ nullable: true })
  clusterName: string;
  @Column({ nullable: true })
  datacenter: string;
  @Column({ nullable: true })
  cpu: string;
  @Column({ nullable: true })
  ram: string;
  @Column({ nullable: true })
  storage: string;
  @Column({ nullable: true })
  osType: string;
  @Column({ nullable: true })
  osVersion: string;
  @Column({ nullable: true })
  ipAddress: string;
  @Column({ nullable: true })
  gateway: string;
  @Column({ nullable: true })
  dns: string;
  @Column({ nullable: true })
  vlan: string;

  // Component Status
  @Column({ default: false })
  backupEnabled: boolean;
  @Column({ nullable: true })
  snapshotPolicy: string;
  @Column({ nullable: true })
  firewallPolicy: string;
  @Column({ default: false })
  tsPlusInstalled: boolean;
  @Column({ default: false })
  antivirusInstalled: boolean;
  @Column({ default: false })
  monitoringEnabled: boolean;
  @Column({ default: false })
  sslInstalled: boolean;

  // Ownership
  @Column({ nullable: true })
  deploymentOwnerId: string;
  @Column({ nullable: true })
  engineerAssignedId: string;
  @Column({ nullable: true })
  teamLeadId: string;
  @Column({ nullable: true })
  auditorId: string;

  @Column({ default: 'pending' })
  deploymentStatus: string;
}
