import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

// Feature Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { AuditModule } from './audit/audit.module';
import { QcModule } from './qc/qc.module';
import { VmDeploymentsModule } from './vm-deployments/vm-deployments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ActivityLogsModule } from './activity-logs/activity-logs.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER', 'mieuxflow'),
        password: config.get<string>('DB_PASSWORD', 'mieuxflow_secret'),
        database: config.get<string>('DB_NAME', 'mieuxflow_db'),
        autoLoadEntities: true,
        synchronize: true, // Use migrations in production!
        logging: false,
      }),
    }),
    AuthModule,
    UsersModule,
    OrdersModule,
    ProjectsModule,
    TasksModule,
    AuditModule,
    QcModule,
    VmDeploymentsModule,
    NotificationsModule,
    ActivityLogsModule,
    DashboardModule,
    DocumentsModule,
  ],
})
export class AppModule {}
