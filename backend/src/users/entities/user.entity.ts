import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Base } from '../../common/entities/base.entity';
import { UserRole, Department } from '../../common/enums';
import { Exclude } from 'class-transformer';

@Entity('users')
@Index(['email'], { unique: true })
export class User extends Base {
  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.READ_ONLY,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: Department,
    nullable: true,
  })
  department: Department;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ nullable: true })
  passwordResetExpires: Date;

  @Column({ default: false })
  mfaEnabled: boolean;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
