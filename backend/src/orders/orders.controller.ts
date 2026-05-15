import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@Query() query: any) { return this.ordersService.findAll(query); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.ordersService.findOne(id); }

  @Post()
  create(@Body() body: any, @Request() req: any) {
    return this.ordersService.create(body, req.user?.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.ordersService.update(id, body, req.user?.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) { return this.ordersService.delete(id); }
}
