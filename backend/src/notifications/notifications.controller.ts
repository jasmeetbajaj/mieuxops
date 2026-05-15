import { Controller, Get, Patch, Delete, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifService: NotificationsService) {}

  @Get()
  getMyNotifications(@Request() req: any, @Query('unread') unread: string) {
    return this.notifService.getUserNotifications(req.user.id, unread === 'true');
  }

  @Get('unread-count')
  getUnreadCount(@Request() req: any) {
    return this.notifService.getUnreadCount(req.user.id);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string) { return this.notifService.markRead(id); }

  @Patch('mark-all-read')
  markAllRead(@Request() req: any) { return this.notifService.markAllRead(req.user.id); }

  @Delete(':id')
  delete(@Param('id') id: string) { return this.notifService.delete(id); }
}
