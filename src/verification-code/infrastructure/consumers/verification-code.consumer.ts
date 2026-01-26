import { MailerService } from '@nestjs-modules/mailer';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { VERIFICATION_CODE_CREATED } from 'src/shared/shared.constants';
import { VerificationCodeCreatedEvent } from '../../domain/events/verification-code-created.event';

@Controller()
export class VerificationCodeConsumer {
  constructor(private readonly mailerService: MailerService) {}

  @EventPattern(VERIFICATION_CODE_CREATED)
  async handleVerificationCodeCreated(
    @Payload() data: VerificationCodeCreatedEvent,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.mailerService.sendMail({
        to: data.email,
        subject: 'Verification Code',
        text: `Your verification code is: ${data.code}`,
      });
      channel.ack(originalMsg);
    } catch (error) {
      channel.nack(originalMsg);
    }
  }
}
