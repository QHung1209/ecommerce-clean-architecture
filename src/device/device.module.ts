import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CreateDeviceUseCase } from './application/use-cases/create-device.use-case';
import { DeleteDeviceUseCase } from './application/use-cases/delete-device.use-case';
import { DeleteAllDeviceUseCase } from './application/use-cases/delete-all-device.use-case';
import { ListDevicesUseCase } from './application/use-cases/list-devices.use-case';
import { DEVICE_REPOSITORY } from './device.constants';
import { PrismaDeviceRepository } from './infrastructure/prisma/repositories/prisma-device.repository';
import { LogoutAllUseCase } from './application/use-cases/logout-all.use-case';
import { LogoutDeviceUseCase, REFRESH_TOKEN_TTL } from './application/use-cases/logout-device.use-case';
import { DeviceController } from './presentation/controllers/device.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, ConfigModule],
  providers: [
    {
      provide: DEVICE_REPOSITORY,
      useClass: PrismaDeviceRepository,
    },
    {
      provide: REFRESH_TOKEN_TTL,
      useFactory: (configService: ConfigService) =>
        +configService.get('JWT_REFRESH_EXPIRES_IN', 604800),
      inject: [ConfigService],
    },
    CreateDeviceUseCase,
    DeleteDeviceUseCase,
    DeleteAllDeviceUseCase,
    ListDevicesUseCase,
    LogoutAllUseCase,
    LogoutDeviceUseCase,
  ],
  exports: [CreateDeviceUseCase, LogoutAllUseCase, LogoutDeviceUseCase],
  controllers: [DeviceController],
})
export class DeviceModule {}
