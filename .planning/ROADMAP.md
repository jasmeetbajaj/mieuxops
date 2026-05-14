# MieuxFlow — Roadmap

## Milestone 1: Full Platform v1

---

### Phase 1: Foundation — Auth, RBAC & Project Scaffold

**Goal:** Establish the full-stack scaffold: Next.js frontend + NestJS backend + PostgreSQL + Docker Compose, with working authentication (JWT), role-based access control (10 roles), and the core database schema.

**Requirements:** AUTH-01..06, RBAC-01..03, DEPLOY-01..03 (partial)

**Deliverables:**
- Monorepo structure: `/frontend` (Next.js 14) + `/backend` (NestJS)
- Docker Compose: postgres, redis, backend, frontend, nginx
- Database schema (all tables: users, roles, permissions, orders, projects, tasks, departments, audit, qc, logs, notifications, documents)
- Auth API: login, logout, refresh, reset password, user management
- RBAC middleware on all backend routes
- Frontend: Login page, auth context, protected routes, layout shell with sidebar
- All 10 roles seeded in database

**Success Criteria:**
1. User can log in and receive JWT; protected routes reject unauthenticated requests
2. Super Admin can create users and assign roles
3. Docker Compose brings up all services healthy
4. All DB tables created via migrations

**Depends on:** —
**UI hint**: yes

---

### Phase 2: Sales Order Module

**Goal:** Sales team can create customer orders that auto-generate Order ID, Ticket ID, Project ID, and trigger project creation with initial department tasks.

**Requirements:** SALES-01..06, AUTO-01

**Deliverables:**
- Sales Order API (CRUD with ID generation)
- Order form UI with all fields (14 project categories, customer info, billing, SLA, teams)
- File attachment support
- Auto-trigger: project creation + initial task routing on order submit
- Orders list view with filters and status

**Success Criteria:**
1. Sales user submits order form → system creates Order ID (ORD-YYYYMM-NNNN), Ticket ID, Project ID
2. Order appears in orders list with all fields
3. File attachments upload and associate correctly
4. Project and initial tasks auto-created on order submission

**Depends on:** Phase 1
**UI hint**: yes

---

### Phase 3: Project Management Core

**Goal:** Full project management with 6 view types, task hierarchy (tasks/subtasks/milestones), dependencies, comments, file uploads, activity feed, global search, and document management.

**Requirements:** PROJ-01..06, TASK-01..05, KANBAN-01..03, SEARCH-01..02, DOC-01..02

**Deliverables:**
- Project detail page with 6 views: Kanban (drag-and-drop), List, Timeline (Gantt-style), Calendar, Dashboard, Workflow
- Task API: create/update/delete tasks, subtasks, milestones, dependencies
- Task statuses (9 states), priority levels, due dates
- Comments and file uploads on tasks/projects
- Activity feed (real-time via Socket.IO)
- Global search API and UI
- Document management: upload, version tracking, download
- Real-time Kanban updates via WebSocket

**Success Criteria:**
1. User can create project, add tasks and subtasks, set dependencies
2. Kanban drag-and-drop moves tasks and updates status in real-time across clients
3. Timeline view shows tasks on date axis with milestones
4. Global search returns results across projects, tasks, orders
5. File upload attaches to task; version tracking shows history

**Depends on:** Phase 2
**UI hint**: yes

---

### Phase 4: Department Workflows & VM Deployment

**Goal:** Department-specific task views for all 12 departments with workflow routing, and VM Deployment Master Form for Infra team.

**Requirements:** DEPT-01..04, VM-01..04

**Deliverables:**
- Department dashboards (each department sees only their tasks)
- Workflow engine: auto-route tasks through department sequence
- Task escalation: blocked tasks notify team lead → manager
- VM Deployment Master Form UI + API (full field set)
- VM records linked to orders/projects
- Department progress updates with comments and screenshot uploads

**Success Criteria:**
1. Each department user sees only tasks assigned to their department
2. Completing a task in department A auto-triggers task in department B per workflow
3. Infra team submits VM form; record stored and linked to project
4. Escalation notification fires when task is marked Blocked

**Depends on:** Phase 3
**UI hint**: yes

---

### Phase 5: Audit & QC Modules

**Goal:** Audit team can verify deployments against compliance checklist and generate pass/fail reports; QC team can approve/reject with send-back capability; only QC-approved projects reach Delivered.

**Requirements:** AUDIT-01..04, QC-01..04

**Deliverables:**
- Audit Center portal (separate view for Auditors)
- 14-item audit checklist with per-item pass/fail/NA
- Risk Score and Compliance Score calculation
- Audit observations and remarks
- Audit report generation (PDF)
- QC Center portal
- QC checklist (service, connectivity, monitoring, backup, security, access)
- QC approve/reject/send-back with mandatory reason
- Project status gate: cannot move to Delivered without QC approval

**Success Criteria:**
1. Auditor completes 14-item checklist; system computes compliance and risk scores
2. Auditor rejects → deployment status changes, engineer notified
3. QC team sends back to department → department sees task re-opened with QC notes
4. Project cannot be set to Delivered if QC status is not Approved

**Depends on:** Phase 4
**UI hint**: yes

---

### Phase 6: Dashboards, Reporting & SLA Engine

**Goal:** Executive dashboards with charts, SLA/TAT engine with breach detection, and export capability (PDF/Excel/CSV).

**Requirements:** DASH-01..04, SLA-01..03

**Deliverables:**
- Executive dashboard: active projects, delayed, SLA violations, team productivity, engineer workload
- Department performance and deployment statistics
- Recharts: pie charts, bar charts, progress bars, area charts
- SLA engine: predefined TAT per product type, breach detection, timer display
- SLA breach notifications (in-app + email)
- Monthly delivery report generation
- PDF export (Puppeteer), Excel export (exceljs), CSV export
- SLA/TAT Dashboard page

**Success Criteria:**
1. Dashboard shows real data: active vs delayed project counts, SLA violation count
2. SLA timer shows countdown; turns red on breach; notification fires
3. PDF report generates and downloads with project data
4. Excel/CSV export contains correct tabular data

**Depends on:** Phase 5
**UI hint**: yes

---

### Phase 7: Customer Portal

**Goal:** Customers can view project progress, download reports, approve handover, and raise comments — with no access to internal data.

**Requirements:** CUST-01..04

**Deliverables:**
- Customer portal (separate route/layout with Customer Viewer role)
- Project progress view (stages, status, completion %)
- Report download for customer-facing documents
- Handover approval flow (customer signs off)
- Comment/ticket system for customer
- Strict data filtering: no internal notes, no audit comments, no escalations visible

**Success Criteria:**
1. Customer Viewer logs in → sees only their project(s) with no internal data
2. Customer downloads PDF report of their project
3. Customer clicks Approve Handover → project moves to final Delivered state
4. Customer comment creates a ticket visible to sales team

**Depends on:** Phase 6
**UI hint**: yes

---

### Phase 8: Automation, Logging & Notifications

**Goal:** Automation triggers for department task routing, comprehensive activity logging (90-day), in-app + email notifications, and notification center.

**Requirements:** AUTO-01..04, LOG-01..03, NOTIF-01..03

**Deliverables:**
- Automation engine (event-based triggers): auto-create firewall task after VM, auto-notify backup team, auto-QC task, auto-close after handover
- Activity log table: captures all user actions with actor, action, target, timestamp
- Log retention policy (90 days), searchable logs UI
- In-app notification system with real-time delivery (Socket.IO)
- Email notification service (Nodemailer / SMTP)
- Notification center page (unread/read, filter by type)
- WhatsApp/Mattermost stubs (architecture ready)

**Success Criteria:**
1. Creating a VM deployment auto-creates firewall configuration task
2. All user actions appear in activity log searchable by user and date
3. Logs older than 90 days are purged by scheduled job
4. In-app notification appears within 2 seconds of triggering event
5. Email sends on SLA breach and QC rejection

**Depends on:** Phase 7

---

### Phase 9: Docker Deployment, Seed Data & Polish

**Goal:** Production-ready Docker Compose, full seed data, installation guide, and final UI polish.

**Requirements:** DEPLOY-01..03, DEMO-01

**Deliverables:**
- Final Docker Compose (frontend, backend, postgres, redis, nginx, minio)
- NGINX config with reverse proxy and HTTPS-ready setup
- .env.example for all services
- Backup scripts for PostgreSQL
- Health checks on all containers
- Comprehensive seed script: demo users (all roles), 5 sample orders, 3 projects, vm deployments, audit records, qc records, notifications
- INSTALLATION.md guide
- API documentation (Swagger via NestJS)
- Final responsive UI polish across all pages

**Success Criteria:**
1. `docker compose up` brings all services healthy
2. Seed script populates demo data; login with demo credentials works
3. Swagger UI accessible at /api/docs
4. All UI pages render correctly on 1280px, 1440px, and 1920px screens

**Depends on:** Phase 8

---

## Summary

| # | Phase | Key Deliverable | Requirements |
|---|-------|----------------|--------------|
| 1 | Foundation | Auth + RBAC + Scaffold + DB | AUTH, RBAC, DEPLOY(partial) |
| 2 | Sales Orders | Order creation, ID generation, project trigger | SALES |
| 3 | Project Management | 6 views, tasks, Kanban, search, docs | PROJ, TASK, KANBAN, SEARCH, DOC |
| 4 | Dept Workflows + VM | Dept routing, VM form | DEPT, VM |
| 5 | Audit & QC | Compliance checklists, reports, gates | AUDIT, QC |
| 6 | Dashboards + SLA | Charts, TAT engine, exports | DASH, SLA |
| 7 | Customer Portal | Customer view, handover | CUST |
| 8 | Automation + Logs | Triggers, activity log, notifications | AUTO, LOG, NOTIF |
| 9 | Docker + Seed + Polish | Production deploy, demo data, docs | DEPLOY, DEMO |
