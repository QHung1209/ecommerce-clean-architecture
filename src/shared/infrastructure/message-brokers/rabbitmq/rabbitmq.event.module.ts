import { Module } from '@nestjs/common';
import {
  EVENT_BUS,
  OTP_CREATED,
  OTP_EXCHANGE,
  OTP_QUEUE,
} from 'src/shared/shared.constants';
import { RabbitMQEventBusAdapter } from './rabbitmq-event-bus.adapter';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import { VerificationCodeConsumer } from 'src/verification-code/infrastructure/consumers/verification-code.consumer';

@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        exchanges: [
          {
            name: OTP_EXCHANGE,
            type: 'direct',
          },
        ],
        uri:
          configService.get('RABBITMQ_URL') ||
          'amqp://admin:admin123@localhost:5672',
        connectionInitOptions: { wait: true, reject: false, timeout: 5000 },
        queues: [
          {
            name: OTP_QUEUE,
            exchange: OTP_EXCHANGE,
            options: {
              durable: true,
            },

            routingKey: [OTP_CREATED],
          },
        ],
        prefetchCount: 1,
      }),
    }),
  ],
  providers: [
    {
      provide: EVENT_BUS,
      useClass: RabbitMQEventBusAdapter,
    },
  ],
  exports: [EVENT_BUS, RabbitMQModule],
})
export class RabbitMQEventModule {}
