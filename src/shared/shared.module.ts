import { Global, Module } from '@nestjs/common';
import { RabbitMQEventModule } from './infrastructure/message-brokers/rabbitmq/rabbitmq.event.module';
import { EmailModule } from './infrastructure/mailer/email.module';
import { PrismaUnitOfWork } from './infrastructure/databases/prisma/prisma-unit-of-work';
import { UNIT_OF_WORK } from './shared.constants';
import { PrismaService } from './infrastructure/databases/prisma/prisma.service';

@Global()
@Module({
  providers: [
    {
      useClass: PrismaUnitOfWork,
      provide: UNIT_OF_WORK,
    },
    PrismaService
  ],
  imports: [RabbitMQEventModule, EmailModule],
  exports: [RabbitMQEventModule, EmailModule, UNIT_OF_WORK],
})
export class SharedModule {}
