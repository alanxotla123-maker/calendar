import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, IsNull } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import * as nodemailer from 'nodemailer';
import { Card } from '../cards/entities/card.entity';
import { Task } from '../tasks/entities/task.entity';

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  onModuleInit() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT ?? '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      this.logger.warn(
        'Las variables de entorno SMTP no están completamente configuradas. Las notificaciones por correo estarán desactivadas.',
      );
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true para puerto 465, false para otros
      auth: {
        user,
        pass,
      },
    });

    this.logger.log('Servidor SMTP de Nodemailer configurado correctamente.');
  }

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    if (!this.transporter) {
      this.logger.warn(`No se envió el correo a ${to} porque el transporte SMTP no está configurado.`);
      return false;
    }

    try {
      const from = process.env.SMTP_FROM ?? '"Calendar & Savings" <noreply@example.com>';
      await this.transporter.sendMail({
        from,
        to,
        subject,
        html,
      });
      this.logger.log(`Correo enviado exitosamente a ${to} - Asunto: ${subject}`);
      return true;
    } catch (error) {
      this.logger.error(`Error enviando correo a ${to}:`, error);
      return false;
    }
  }

  /**
   * Helper para obtener la fecha de un día de mes específico cuidando el fin de mes
   */
  private getNextDateForDay(today: Date, dayOfMonth: number): Date {
    const year = today.getFullYear();
    const month = today.getMonth();

    // Obtener la fecha segura en el mes actual
    let targetDate = this.getSafeDate(year, month, dayOfMonth);

    // Si ya pasó hoy, programar para el mes siguiente
    if (targetDate.getTime() <= today.getTime()) {
      targetDate = this.getSafeDate(year, month + 1, dayOfMonth);
    }

    return targetDate;
  }

  private getSafeDate(year: number, month: number, day: number): Date {
    const lastDay = new Date(year, month + 1, 0).getDate();
    const safeDay = Math.min(day, lastDay);
    return new Date(year, month, safeDay);
  }

  private getDaysBetween(date1: Date, date2: Date): number {
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    const diffTime = d2.getTime() - d1.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Se ejecuta todos los días a las 9:00 AM
  @Cron('0 9 * * *')
  async runDailyNotifications() {
    this.logger.log('Iniciando cron job diario de notificaciones...');
    const today = new Date();

    await this.checkCardNotifications(today);
    await this.checkTaskNotifications(today);
  }

  async checkCardNotifications(today: Date) {
    const cards = await this.cardRepository.find();
    this.logger.log(`Revisando alertas para ${cards.length} tarjetas...`);

    for (const card of cards) {
      if (!card.userEmail) continue;

      // 1. Verificar Fecha de Corte (closingDay)
      const nextClosingDate = this.getNextDateForDay(today, card.closingDay);
      const daysUntilClosing = this.getDaysBetween(today, nextClosingDate);

      if (daysUntilClosing === 3 || daysUntilClosing === 1) {
        const subject = `⚠️ Recordatorio: Fecha de corte de tu tarjeta ${card.name}`;
        const html = `
          <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
            <h2>Hola,</h2>
            <p>Te recordamos que la <strong>fecha de corte</strong> de tu tarjeta <strong>${card.name}</strong> es en <strong>${daysUntilClosing} ${daysUntilClosing === 1 ? 'día' : 'días'}</strong> (${nextClosingDate.toLocaleDateString()}).</p>
            <p>Asegúrate de revisar tus transacciones para este periodo.</p>
            <br/>
            <p>Atentamente,<br/>El equipo de Calendar & Savings</p>
          </div>
        `;
        await this.sendEmail(card.userEmail, subject, html);
      }

      // 2. Verificar Fecha Límite de Pago (dueDate)
      const nextDueDate = this.getNextDateForDay(today, card.dueDate);
      const daysUntilDue = this.getDaysBetween(today, nextDueDate);

      if (daysUntilDue === 3 || daysUntilDue === 1) {
        const subject = `🚨 ¡Acción requerida! Pago próximo para tu tarjeta ${card.name}`;
        const html = `
          <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
            <h2>Hola,</h2>
            <p>Te recordamos que la <strong>fecha límite de pago</strong> de tu tarjeta <strong>${card.name}</strong> es en <strong>${daysUntilDue} ${daysUntilDue === 1 ? 'día' : 'días'}</strong> (${nextDueDate.toLocaleDateString()}).</p>
            <p>Evita cargos adicionales realizando tu pago a tiempo.</p>
            <br/>
            <p>Atentamente,<br/>El equipo de Calendar & Savings</p>
          </div>
        `;
        await this.sendEmail(card.userEmail, subject, html);
      }
    }
  }

  async checkTaskNotifications(today: Date) {
    // Buscar tareas no completadas y que venzan en las próximas 24 horas
    const oneDayFromNow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    const tasks = await this.taskRepository.find({
      where: {
        isCompleted: false,
        dueDate: Between(today, oneDayFromNow),
      },
    });

    this.logger.log(`Revisando alertas para ${tasks.length} tareas próximas a vencer...`);

    // Agrupar tareas por correo electrónico del usuario para no enviar múltiples correos
    const tasksByUser: Record<string, Task[]> = {};
    for (const task of tasks) {
      if (!task.userEmail) continue;
      if (!tasksByUser[task.userEmail]) {
        tasksByUser[task.userEmail] = [];
      }
      tasksByUser[task.userEmail].push(task);
    }

    for (const [email, userTasks] of Object.entries(tasksByUser)) {
      const subject = `📅 Tareas pendientes por vencer en las próximas 24 horas`;
      const tasksListHtml = userTasks
        .map(
          (t) => `
          <li>
            <strong>${t.title}</strong> ${t.description ? `- ${t.description}` : ''} 
            (Vence: ${new Date(t.dueDate!).toLocaleString()})
          </li>`,
        )
        .join('');

      const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
          <h2>Hola,</h2>
          <p>Tienes las siguientes tareas pendientes que vencen pronto:</p>
          <ul>
            ${tasksListHtml}
          </ul>
          <p>Por favor completas estas tareas antes de que expire su plazo.</p>
          <br/>
          <p>Atentamente,<br/>El equipo de Calendar & Savings</p>
        </div>
      `;

      await this.sendEmail(email, subject, html);
    }
  }
}
