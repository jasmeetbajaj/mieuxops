# MieuxFlow — Enterprise Operations Platform

## What This Is

MieuxFlow is an enterprise-grade browser-based Project Management, Deployment Tracking, Audit, and Workflow Automation platform for Mieux Technologies Pvt Ltd. It combines Asana-style project management, Jira-style ticketing, ServiceNow-style workflow approvals, and MSP deployment lifecycle management into a single operational command center.

## Core Value

A centralized platform for Mieux Technologies to manage IT deployments, audit compliance, QC validation, team collaboration, SLAs, and customer delivery lifecycle end-to-end.

## Company

- **Client:** Mieux Technologies Pvt Ltd
- **Platform Name:** MieuxFlow
- **Target Users:** Internal teams (Sales, Infra, Firewall, Backup, AV, SOC, Zabbix, Cloud, Network, Audit, QC, Management) + Customer Portal

## Stack

- **Frontend:** React + Next.js 14 (App Router)
- **Backend:** Node.js + NestJS (REST API)
- **Database:** PostgreSQL
- **Cache/Queue:** Redis
- **Realtime:** Socket.IO
- **Auth:** JWT + RBAC
- **Containerization:** Docker + Docker Compose
- **Reverse Proxy:** NGINX
- **Storage:** S3-compatible (MinIO for local, AWS S3 for cloud)
- **PDF:** Puppeteer / pdfkit
- **UI Libraries:** shadcn/ui, Recharts, dnd-kit

## Key Modules

1. Sales Order Management (Order/Ticket/Project ID generation)
2. Project Management (Kanban, List, Timeline, Calendar, Dashboard, Workflow views)
3. Department Workflow Engine (12 departments)
4. VM Deployment Master Form
5. Audit Management (Compliance verification, checklists, reports)
6. QC (Quality Control) Module
7. Advanced Task Management (SLA/TAT timers, escalations, dependencies)
8. Kanban System (drag-and-drop, real-time)
9. Dashboards & Reporting (PDF/Excel/CSV export)
10. TAT & SLA Engine (per product type TAT, breach alerts)
11. Enterprise RBAC (10 roles, granular permissions)
12. Customer Portal (read-only project view, handover approval)
13. Automation Engine (auto-task creation, escalations)
14. Activity Logging (90-day retention, searchable)
15. Notification System (in-app, email; WhatsApp/Mattermost ready)
16. Search & Filters (global search, advanced filters)
17. Document Management (versioned uploads)
18. API & Integration Ready (Zabbix, Proxmox, VMware, FortiGate, etc.)

## Deployment

- Docker Compose (local development + production)
- Target server: 103.89.45.174 (cloud)
- HTTPS via NGINX
- Persistent volumes for PostgreSQL, Redis, MinIO

## Roles

Super Admin, Owner, Sales Head, Sales User, Department Head, Engineer, Auditor, QC Team, Customer Viewer, Read Only User

## Requirements

### Active

- [ ] Authentication (JWT, RBAC, MFA-ready, session timeout)
- [ ] Sales Order module with auto-generated Order/Ticket/Project IDs
- [ ] Project management with 6 view types
- [ ] Department workflow engine for 12 departments
- [ ] VM Deployment Master Form
- [ ] Audit module with checklists, pass/fail, compliance score
- [ ] QC module with approve/reject/send-back
- [ ] Task management with SLA/TAT timers
- [ ] Kanban with drag-and-drop and real-time updates
- [ ] Executive dashboards with charts
- [ ] PDF/Excel/CSV export
- [ ] TAT/SLA engine with escalations
- [ ] RBAC with 10 roles and granular permissions
- [ ] Customer portal (limited view)
- [ ] Automation engine (auto-task triggers)
- [ ] Activity logging (90-day retention)
- [ ] In-app + email notifications
- [ ] Global search and advanced filters
- [ ] Document management with versioning
- [ ] Docker Compose deployment
- [ ] Sample demo data

### Out of Scope (v1)

- AI features (architecture ready, not implemented)
- WhatsApp/Mattermost notifications (stubs only)
- Kubernetes deployment (Docker only)
- External integrations (Zabbix, Proxmox, etc.) — API stubs only

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js App Router | Modern React patterns, SSR for performance | — |
| NestJS | Enterprise-grade, modular, TypeScript-native | — |
| PostgreSQL | Relational, ACID, ideal for audit/compliance | — |
| shadcn/ui | Accessible, customizable components | — |
| Docker Compose | Simple local + cloud deployment | — |

---
*Last updated: 2026-05-14 after initialization*
