import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './shared/infrastructure/database/prisma/prisma.module';
import { RedisModule } from './shared/infrastructure/cache/redis/redis.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PermissionModule } from './permission/permission.module';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from './role/role.module';
import { DeviceModule } from './device/device.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RedisModule,
    UserModule,
    AuthModule,
    PermissionModule,
    RoleModule,
    DeviceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
