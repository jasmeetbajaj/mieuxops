import { Controller, Get, Post, Put, Patch, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('stats') getStats() { return this.projectsService.getStats(); }
  @Get() findAll(@Query() q: any) { return this.projectsService.findAll(q); }
  @Get(':id') findOne(@Param('id') id: string) { return this.projectsService.findOne(id); }
  @Get(':id/tasks') getTasks(@Param('id') id: string) { return this.projectsService.getTasksByProject(id); }

  @Post()
  create(@Body() body: any, @Request() req: any) {
    return this.projectsService.create(body, req.user?.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.projectsService.update(id, body, req.user?.id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: any, @Request() req: any) {
    return this.projectsService.updateStatus(id, status, req.user?.id);
  }
}
