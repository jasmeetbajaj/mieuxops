import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ActivityLogsService } from './activity-logs.service';

@ApiTags('Activity Logs')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly logsService: ActivityLogsService) {}

  @Get()
  findAll(@Query() q: any) { return this.logsService.findAll(q); }
}
