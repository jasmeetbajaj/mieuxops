import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { VmDeploymentsService } from './vm-deployments.service';

@ApiTags('VM Deployments')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('vm-deployments')
export class VmDeploymentsController {
  constructor(private readonly vmService: VmDeploymentsService) {}

  @Get() findAll(@Query() q: any) { return this.vmService.findAll(q); }
  @Get(':id') findOne(@Param('id') id: string) { return this.vmService.findOne(id); }
  @Post() create(@Body() body: any, @Request() req: any) { return this.vmService.create(body, req.user?.id); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any, @Request() req: any) { return this.vmService.update(id, body, req.user?.id); }
  @Delete(':id') delete(@Param('id') id: string) { return this.vmService.delete(id); }
}
