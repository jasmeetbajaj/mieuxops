# MieuxFlow — v1 Requirements

## v1 Requirements

### AUTH — Authentication & Access Control
- [ ] **AUTH-01**: User can log in with email/password and receive JWT token
- [ ] **AUTH-02**: System enforces role-based access control on all routes
- [ ] **AUTH-03**: User session times out after 8 hours of inactivity
- [ ] **AUTH-04**: Super Admin can create, edit, and deactivate user accounts
- [ ] **AUTH-05**: User can reset password via email link
- [ ] **AUTH-06**: Each user is assigned exactly one role with permission set

### SALES — Sales Order Module
- [ ] **SALES-01**: Sales user can create a new customer order with all required fields
- [ ] **SALES-02**: System auto-generates unique Order ID, Ticket ID, and Project ID on order creation
- [ ] **SALES-03**: Order supports 14 project categories (VM, Cloud Migration, Backup, etc.)
- [ ] **SALES-04**: Order captures customer info, billing, SLA/TAT, assigned teams, environment notes
- [ ] **SALES-05**: Order can have file attachments and internal notes
- [ ] **SALES-06**: Order creation triggers automatic project and initial tasks

### PROJ — Project Management
- [ ] **PROJ-01**: User can view projects in Kanban, List, Timeline, Calendar, Dashboard, and Workflow views
- [ ] **PROJ-02**: Project supports tasks, subtasks, milestones, and dependencies
- [ ] **PROJ-03**: User can add comments, notes, and file uploads to any project or task
- [ ] **PROJ-04**: User can assign engineers to tasks and track time
- [ ] **PROJ-05**: Project has an activity feed showing all changes
- [ ] **PROJ-06**: Project workflow follows: Project → Tasks → Subtasks → QC → Closure

### DEPT — Department Workflow Engine
- [ ] **DEPT-01**: Each of 12 departments receives tasks assigned to them
- [ ] **DEPT-02**: Department member can update progress, add comments, upload files, mark completion
- [ ] **DEPT-03**: Department member can escalate blocked tasks to team lead
- [ ] **DEPT-04**: Workflow automatically routes tasks between departments in defined sequence

### VM — VM Deployment Master Form
- [ ] **VM-01**: Infra team can fill complete VM deployment form with customer info, VM details, and ownership
- [ ] **VM-02**: VM form captures all network details (IP, Gateway, DNS, VLAN)
- [ ] **VM-03**: VM form tracks installed components (TS Plus, AV, Monitoring, SSL, Backup, Snapshot)
- [ ] **VM-04**: VM record is linked to the parent order and project

### AUDIT — Audit Management Module
- [ ] **AUDIT-01**: Auditor can review deployments against 14-item compliance checklist
- [ ] **AUDIT-02**: Auditor can approve or reject a deployment with remarks
- [ ] **AUDIT-03**: Audit generates Pass/Fail report with Risk Score and Compliance Score
- [ ] **AUDIT-04**: Auditor can raise audit observations and compare scope vs deployed

### QC — Quality Control Module
- [ ] **QC-01**: QC team can verify service functionality via checklist
- [ ] **QC-02**: QC team can approve, reject, or send back to department
- [ ] **QC-03**: Only QC-approved projects can transition to "Delivered" status
- [ ] **QC-04**: QC rejection notifies responsible team with reason

### TASK — Advanced Task Management
- [ ] **TASK-01**: Tasks support parent/subtask hierarchy and inter-task dependencies
- [ ] **TASK-02**: Tasks have 9 status states (Pending, Assigned, In Progress, Waiting, Blocked, QC Pending, Audit Pending, Completed, Closed)
- [ ] **TASK-03**: Each task has SLA timer and TAT timer with breach alerting
- [ ] **TASK-04**: Overdue tasks auto-escalate to team lead then manager
- [ ] **TASK-05**: Tasks support priority levels and recurring task configuration

### KANBAN — Kanban Board
- [ ] **KANBAN-01**: User can view and move tasks across Kanban columns via drag-and-drop
- [ ] **KANBAN-02**: Kanban updates in real-time across all connected clients
- [ ] **KANBAN-03**: Columns: To Do, Assigned, In Progress, Audit, QC, Completed

### DASH — Dashboards & Reporting
- [ ] **DASH-01**: Executive dashboard shows active projects, delays, SLA violations, team productivity
- [ ] **DASH-02**: Charts include pie charts, progress bars, department utilization, SLA compliance
- [ ] **DASH-03**: Reports exportable in PDF, Excel, and CSV formats
- [ ] **DASH-04**: Monthly delivery report auto-generates

### SLA — TAT & SLA Engine
- [ ] **SLA-01**: Each product type has predefined TAT (VM=4h, Firewall=8h, Backup=2h, etc.)
- [ ] **SLA-02**: System tracks start time, completion time, delays, and SLA breaches
- [ ] **SLA-03**: SLA breaches trigger notifications to team lead and manager

### RBAC — Enterprise RBAC
- [ ] **RBAC-01**: 10 distinct roles with granular permission sets
- [ ] **RBAC-02**: Permissions include: View, Edit, Approve, Reject, Delete, Export, Audit Access, Workflow Edit, Team Management
- [ ] **RBAC-03**: Permission enforcement at API and UI levels

### CUST — Customer Portal
- [ ] **CUST-01**: Customer can view project progress and deployment stages
- [ ] **CUST-02**: Customer can download reports and approve handover
- [ ] **CUST-03**: Customer can raise comments and track tickets
- [ ] **CUST-04**: Customer cannot see internal notes, audit comments, or escalations

### AUTO — Automation Engine
- [ ] **AUTO-01**: System auto-creates firewall task after VM creation
- [ ] **AUTO-02**: System auto-notifies backup team after firewall completion
- [ ] **AUTO-03**: System auto-generates QC task when all department tasks complete
- [ ] **AUTO-04**: System auto-closes project after QC approval and customer handover

### LOG — Activity Logging
- [ ] **LOG-01**: All user actions logged: login, task changes, assignments, uploads, approvals
- [ ] **LOG-02**: Logs retained for minimum 90 days
- [ ] **LOG-03**: Logs are searchable by user, action type, date range

### NOTIF — Notification System
- [ ] **NOTIF-01**: In-app notifications for task assignments, status changes, comments
- [ ] **NOTIF-02**: Email notifications for SLA breach, QC rejection, audit rejection
- [ ] **NOTIF-03**: Notification center shows all notifications with read/unread state

### SEARCH — Search & Filters
- [ ] **SEARCH-01**: Global search across projects, tasks, orders, and customers
- [ ] **SEARCH-02**: Advanced filtering by customer, engineer, department, status, SLA, date, product type, priority

### DOC — Document Management
- [ ] **DOC-01**: Users can upload config files, screenshots, PDFs, and deployment reports
- [ ] **DOC-02**: Documents have version tracking and are linked to projects/tasks

### DEPLOY — Docker Deployment
- [ ] **DEPLOY-01**: Full Docker Compose setup with frontend, backend, PostgreSQL, Redis, NGINX
- [ ] **DEPLOY-02**: Environment configuration via .env files
- [ ] **DEPLOY-03**: Persistent volumes, health checks, backup scripts included

### DEMO — Sample Data
- [ ] **DEMO-01**: Seed script populates realistic demo data for all modules

## v2 Requirements (Deferred)

- AI deployment suggestions, audit verification, SLA risk prediction
- WhatsApp notifications
- Mattermost integration
- Kubernetes deployment
- External tool integrations (Zabbix, Proxmox, FortiGate, etc.)
- Mobile app

## Out of Scope (v1)

- AI features — architecture ready, implementation deferred
- WhatsApp/Mattermost — stubs only
- Kubernetes — Docker only in v1
- External API integrations — REST API stubs only
- Multi-tenancy — single tenant in v1

## Traceability

| Requirement | Phase |
|-------------|-------|
| AUTH-01..06 | Phase 1 |
| SALES-01..06 | Phase 2 |
| PROJ-01..06, TASK-01..05, KANBAN-01..03 | Phase 3 |
| DEPT-01..04, VM-01..04 | Phase 4 |
| AUDIT-01..04, QC-01..04 | Phase 5 |
| DASH-01..04, SLA-01..03 | Phase 6 |
| RBAC-01..03 | Phase 1 |
| CUST-01..04 | Phase 7 |
| AUTO-01..04, LOG-01..03, NOTIF-01..03 | Phase 8 |
| SEARCH-01..02, DOC-01..02 | Phase 3 |
| DEPLOY-01..03 | Phase 9 |
| DEMO-01 | Phase 9 |
