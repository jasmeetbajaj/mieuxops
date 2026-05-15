import { Controller, Get, Post, Put, Patch, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';

@ApiTags('Audit')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get() findAll(@Query() q: any) { return this.auditService.findAll(q); }
  @Get(':id') findOne(@Param('id') id: string) { return this.auditService.findOne(id); }
  @Post() create(@Body() body: any, @Request() req: any) { return this.auditService.create(body, req.user?.id); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.auditService.update(id, body); }
  @Patch(':id/approve') approve(@Param('id') id: string, @Body('remarks') remarks: string, @Request() req: any) { return this.auditService.approve(id, remarks, req.user?.id); }
  @Patch(':id/reject') reject(@Param('id') id: string, @Body('remarks') remarks: string, @Request() req: any) { return this.auditService.reject(id, remarks, req.user?.id); }
}
