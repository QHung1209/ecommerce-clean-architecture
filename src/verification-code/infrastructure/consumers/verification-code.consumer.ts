import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {
  OTP_CREATED,
  OTP_EXCHANGE,
  OTP_QUEUE,
} from 'src/shared/shared.constants';

@Injectable()
export class VerificationCodeConsumer {
  constructor(private readonly mailerService: MailerService) {}

  @RabbitSubscribe({
    exchange: OTP_EXCHANGE,
    queue: OTP_QUEUE,
    routingKey: OTP_CREATED,
    allowNonJsonMessages: true,
    errorHandler: (channel, msg, error) => {
      console.error('Consumer error:', error);
      if (msg) {
        channel.nack(msg, false, false);
      }
    },
  })
  async handleVerificationCodeCreated(msg: any): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: msg.email,
        subject: 'Verification Code',
        text: `Your verification code is: ${msg.code}`,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }
}
