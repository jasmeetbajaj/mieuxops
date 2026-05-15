import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { Document } from './entities/document.entity';
import { ActivityLog } from '../activity-logs/entities/activity-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document, ActivityLog])],
  providers: [DocumentsService],
  controllers: [DocumentsController],
  exports: [DocumentsService],
})
export class DocumentsModule {}
