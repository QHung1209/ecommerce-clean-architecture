import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EVENT_BUS, EVENTS_SERVICE } from 'src/shared/shared.constants';
import { RabbitMQEventBusAdapter } from './rabbitmq-event-bus.adapter';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: EVENTS_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL || 'amqp://admin:admin123@localhost:5672',
          ],
          queue: 'events_queue',
          queueOptions: {
            durable: true,
          },
        }, 
      },
    ]),
  ],
  providers: [
    {
      provide: EVENT_BUS,
      useClass: RabbitMQEventBusAdapter,
    },
  ],
  exports: [EVENT_BUS],
})
export class RabbitMQModule {}
