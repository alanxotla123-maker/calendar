import { Controller, Post, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('trigger')
  @HttpCode(HttpStatus.OK)
  async triggerNotifications() {
    this.logger.log('Disparo manual de notificaciones recibido.');
    await this.notificationsService.runDailyNotifications();
    return {
      message: 'Chequeo de notificaciones ejecutado exitosamente.',
      timestamp: new Date().toISOString(),
    };
  }
}
