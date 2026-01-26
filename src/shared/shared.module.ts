import { Global, Module } from '@nestjs/common';
import { RabbitMQModule } from './infrastructure/message-brokers/rabbitmq/rabbitmq.module';
import { EmailModule } from './infrastructure/mailer/email.module';

@Global()
@Module({
  imports: [RabbitMQModule, EmailModule],
  exports: [RabbitMQModule, EmailModule],
})
export class SharedModule {}
