import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { IEmailService } from 'src/shared/domain/interfaces/email-service.interface';

export class EmailService implements IEmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async sendEmail(
    email: string,
    subject: string,
    content: string,
  ): Promise<void> {
    this.mailerService.sendMail({
      to: email,
      from: this.configService.get<string>('EMAIL_FROM'),
      subject,
      html: content,
    });
  }
}
