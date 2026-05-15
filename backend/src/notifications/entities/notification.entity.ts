import { Entity, Column } from 'typeorm';
import { Base } from '../../common/entities/base.entity';
import { NotificationType } from '../../common/enums';

@Entity('notifications')
export class Notification extends Base {
  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  relatedEntityId: string;

  @Column({ nullable: true })
  relatedEntityType: string; // 'project' | 'task' | 'order' etc.

  @Column({ nullable: true })
  actionUrl: string;
}
