import { Injectable } from '@nestjs/common';
import { EventBus } from '../../../domain/interfaces/event-bus.interface';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class RabbitMQEventBusAdapter implements EventBus {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publish(exchange: string, routingKey: string, msg: any): Promise<void> {
    await this.amqpConnection.publish(exchange, routingKey, msg);
  }
}
