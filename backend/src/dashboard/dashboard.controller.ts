import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary') getSummary() { return this.dashboardService.getExecutiveSummary(); }
  @Get('projects-by-status') getByStatus() { return this.dashboardService.getProjectsByStatus(); }
  @Get('projects-by-category') getByCategory() { return this.dashboardService.getProjectsByCategory(); }
  @Get('engineer-workload') getWorkload() { return this.dashboardService.getEngineerWorkload(); }
  @Get('department-performance') getDeptPerf() { return this.dashboardService.getDepartmentPerformance(); }
  @Get('recent-projects') getRecent(@Query('limit') limit: number) { return this.dashboardService.getRecentProjects(limit); }
  @Get('sla-report') getSla() { return this.dashboardService.getSlaReport(); }
  @Get('monthly-delivery') getMonthly() { return this.dashboardService.getMonthlyDelivery(); }
}
