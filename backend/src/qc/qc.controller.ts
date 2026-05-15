import { Controller, Get, Post, Put, Patch, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { QcService } from './qc.service';

@ApiTags('QC')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('qc')
export class QcController {
  constructor(private readonly qcService: QcService) {}

  @Get() findAll(@Query() q: any) { return this.qcService.findAll(q); }
  @Get(':id') findOne(@Param('id') id: string) { return this.qcService.findOne(id); }
  @Post() create(@Body() body: any, @Request() req: any) { return this.qcService.create(body, req.user?.id); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.qcService.update(id, body); }
  @Patch(':id/approve') approve(@Param('id') id: string, @Body('remarks') remarks: string, @Request() req: any) { return this.qcService.approve(id, remarks, req.user?.id); }
  @Patch(':id/reject') reject(@Param('id') id: string, @Body() body: { reason: string }, @Request() req: any) { return this.qcService.reject(id, body.reason, req.user?.id); }
  @Patch(':id/send-back') sendBack(@Param('id') id: string, @Body() body: { department: string; reason: string }, @Request() req: any) { return this.qcService.sendBack(id, body.department, body.reason, req.user?.id); }
}
