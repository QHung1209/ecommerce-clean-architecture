import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { TransformInterceptor } from './shared/presentation/interceptors/transform.interceptor';
import { LoggingInterceptor } from './shared/presentation/interceptors/logging.interceptor';
import { RedisIoAdapter } from './shared/infrastructure/cache/redis/redis-io.adapter';
import { RedisService } from './shared/infrastructure/cache/redis/redis.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setup Redis adapter for WebSocket
  const redisService = app.get(RedisService);
  const redisIoAdapter = new RedisIoAdapter(app, redisService);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties exist
      transform: true, // Auto-transform payloads to DTO instances
    }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(process.env.PORT || 3003);
}
bootstrap();
