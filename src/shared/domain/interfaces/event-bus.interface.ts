export interface EventBus {
  publish<T>(pattern: string, event: T): void;
}
