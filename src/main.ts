import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { TransformInterceptor } from './shared/infrastructure/interceptors/transform.interceptor';
import { LoggingInterceptor } from './shared/infrastructure/interceptors/logging.interceptor';
import { RedisIoAdapter } from './shared/infrastructure/cache/redis/redis-io.adapter';
import { RedisService } from './shared/infrastructure/cache/redis/redis.service';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setup RabbitMQ microservices
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        process.env.RABBITMQ_URL || 'amqp://admin:admin123@localhost:5672',
      ],
      queue: 'events_queue',
      queueOptions: {
        durable: true,
      },
      noAck: false,
    },
  });

  await app.startAllMicroservices();

  const redisService = app.get(RedisService);
  const redisIoAdapter = new RedisIoAdapter(app, redisService);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(process.env.PORT || 3003);
}
bootstrap();
