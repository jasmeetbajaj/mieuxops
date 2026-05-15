export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  OWNER = 'owner',
  SALES_HEAD = 'sales_head',
  SALES_USER = 'sales_user',
  DEPARTMENT_HEAD = 'department_head',
  ENGINEER = 'engineer',
  AUDITOR = 'auditor',
  QC_TEAM = 'qc_team',
  CUSTOMER_VIEWER = 'customer_viewer',
  READ_ONLY = 'read_only',
}

export enum Department {
  INFRA = 'infra',
  FIREWALL = 'firewall',
  BACKUP = 'backup',
  AV = 'av',
  SOC = 'soc',
  ZABBIX = 'zabbix',
  CLOUD = 'cloud',
  NETWORK = 'network',
  AUDIT = 'audit',
  QC = 'qc',
  MANAGEMENT = 'management',
  SALES = 'sales',
}

export enum ProjectStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  QC_PENDING = 'qc_pending',
  AUDIT_PENDING = 'audit_pending',
  DELIVERED = 'delivered',
  CLOSED = 'closed',
}

export enum TaskStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  WAITING = 'waiting',
  BLOCKED = 'blocked',
  QC_PENDING = 'qc_pending',
  AUDIT_PENDING = 'audit_pending',
  COMPLETED = 'completed',
  CLOSED = 'closed',
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ProjectCategory {
  VM_DEPLOYMENT = 'vm_deployment',
  CLOUD_MIGRATION = 'cloud_migration',
  BACKUP_DEPLOYMENT = 'backup_deployment',
  FIREWALL_SETUP = 'firewall_setup',
  ZABBIX_MONITORING = 'zabbix_monitoring',
  EMAIL_HOSTING = 'email_hosting',
  DLP_DEPLOYMENT = 'dlp_deployment',
  SOC_DEPLOYMENT = 'soc_deployment',
  AV_DEPLOYMENT = 'av_deployment',
  CLOUD_INFRA = 'cloud_infra',
  KUBERNETES = 'kubernetes',
  DATABASE_SETUP = 'database_setup',
  AUDIT_PROJECT = 'audit_project',
  MANAGED_SERVICES = 'managed_services',
}

export enum BillingType {
  ONE_TIME = 'one_time',
  MONTHLY = 'monthly',
  ANNUAL = 'annual',
  PROJECT_BASED = 'project_based',
}

export enum EnvironmentType {
  DEMO = 'demo',
  PRODUCTION = 'production',
  STAGING = 'staging',
}

export enum AuditStatus {
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  PASSED = 'passed',
  FAILED = 'failed',
  OBSERVATION_RAISED = 'observation_raised',
}

export enum QcStatus {
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SENT_BACK = 'sent_back',
}

export enum NotificationType {
  TASK_ASSIGNED = 'task_assigned',
  STATUS_CHANGED = 'status_changed',
  SLA_BREACH = 'sla_breach',
  COMMENT_ADDED = 'comment_added',
  QC_REJECTED = 'qc_rejected',
  AUDIT_REJECTED = 'audit_rejected',
  ESCALATION = 'escalation',
  PROJECT_CREATED = 'project_created',
  HANDOVER_APPROVED = 'handover_approved',
}
