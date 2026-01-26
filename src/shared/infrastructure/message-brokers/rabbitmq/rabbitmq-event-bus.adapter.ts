import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventBus } from '../../../domain/interfaces/event-bus.interface';
import { EVENTS_SERVICE } from 'src/shared/shared.constants';

@Injectable()
export class RabbitMQEventBusAdapter implements EventBus {
  constructor(@Inject(EVENTS_SERVICE) private readonly client: ClientProxy) {}

  publish<T>(pattern: string, event: T): void {
    this.client.emit(pattern, event);
  }
}
