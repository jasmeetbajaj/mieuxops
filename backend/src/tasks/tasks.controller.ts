import { Controller, Get, Post, Put, Patch, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get() findAll(@Query() q: any) { return this.tasksService.findAll(q); }
  @Get(':id') findOne(@Param('id') id: string) { return this.tasksService.findOne(id); }
  @Get('kanban/:projectId') getKanban(@Param('projectId') pid: string) { return this.tasksService.getKanbanBoard(pid); }

  @Post()
  create(@Body() body: any, @Request() req: any) { return this.tasksService.create(body, req.user?.id); }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.tasksService.update(id, body, req.user?.id);
  }

  @Patch(':id/kanban')
  updateKanban(@Param('id') id: string, @Body() body: { column: string; position: number }, @Request() req: any) {
    return this.tasksService.updateKanbanPosition(id, body.column, body.position, req.user?.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) { return this.tasksService.delete(id); }
}
