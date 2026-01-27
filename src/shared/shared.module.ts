import { Global, Module } from '@nestjs/common';
import { RabbitMQEventModule } from './infrastructure/message-brokers/rabbitmq/rabbitmq.event.module';
import { EmailModule } from './infrastructure/mailer/email.module';

@Global()
@Module({
  imports: [RabbitMQEventModule, EmailModule],
  exports: [RabbitMQEventModule, EmailModule],
})
export class SharedModule {}
