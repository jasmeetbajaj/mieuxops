import { Entity, Column } from 'typeorm';
import { Base } from '../../common/entities/base.entity';

@Entity('comments')
export class Comment extends Base {
  @Column()
  content: string;

  @Column()
  authorId: string;

  @Column({ nullable: true })
  authorName: string;

  @Column({ nullable: true })
  projectId: string;

  @Column({ nullable: true })
  taskId: string;

  @Column({ default: false })
  isInternal: boolean; // hidden from customer portal
}

@Entity('documents')
export class Document extends Base {
  @Column()
  fileName: string;

  @Column()
  originalName: string;

  @Column()
  mimeType: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column()
  url: string;

  @Column({ nullable: true })
  projectId: string;

  @Column({ nullable: true })
  taskId: string;

  @Column({ nullable: true })
  orderId: string;

  @Column()
  uploadedById: string;

  @Column({ default: 1 })
  version: number;

  @Column({ nullable: true })
  previousVersionId: string;

  @Column({ nullable: true })
  description: string;
}
