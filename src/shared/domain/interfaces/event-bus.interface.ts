export interface EventBus {
  publish(exchange: string, routingKey: string, msg: any): Promise<void>;
}
