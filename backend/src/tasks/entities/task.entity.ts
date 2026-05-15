import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from '../../common/entities/base.entity';
import { TaskStatus, Priority, Department } from '../../common/enums';

@Entity('tasks')
export class Task extends Base {
  @Column()
  title: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  projectId: string;

  @Column({ nullable: true })
  parentTaskId: string; // for subtasks

  @Column({ nullable: true })
  dependsOnTaskId: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: Priority,
    default: Priority.MEDIUM,
  })
  priority: Priority;

  @Column({
    type: 'enum',
    enum: Department,
    nullable: true,
  })
  department: Department;

  @Column({ nullable: true })
  assignedToId: string;

  @Column({ nullable: true })
  assignedById: string;

  @Column({ nullable: true, type: 'date' })
  dueDate: Date;

  @Column({ nullable: true, type: 'timestamptz' })
  startedAt: Date;

  @Column({ nullable: true, type: 'timestamptz' })
  completedAt: Date;

  @Column({ nullable: true })
  slaDuration: string; // e.g. "4h"

  @Column({ nullable: true, type: 'timestamptz' })
  slaDeadline: Date;

  @Column({ default: false })
  slaBreached: boolean;

  @Column({ default: false })
  isRecurring: boolean;

  @Column({ nullable: true })
  recurringPattern: string;

  @Column({ nullable: true, type: 'text' })
  blockerReason: string;

  @Column({ nullable: true, type: 'text' })
  internalChecklist: string; // JSON string of checklist items

  @Column({ default: false })
  isMilestone: boolean;

  @Column({ default: 0 })
  position: number; // for Kanban ordering

  @Column({ nullable: true })
  kanbanColumn: string;

  @Column({ nullable: true, type: 'int' })
  estimatedHours: number;

  @Column({ nullable: true, type: 'int' })
  loggedHours: number;
}
