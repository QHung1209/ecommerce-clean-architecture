import { Module } from '@nestjs/common';
import { CreateDeviceUseCase } from './application/use-cases/create-device.use-case';
import { DeleteDeviceUseCase } from './application/use-cases/delete-device.use-case';
import { DeleteAllDeviceUseCase } from './application/use-cases/delete-all-device.use-case';
import { ListDevicesUseCase } from './application/use-cases/list-devices.use-case';
import { DEVICE_REPOSITORY } from './device.constants';
import { PrismaDeviceRepository } from './infrastructure/prisma/repositories/prisma-device.repository';
import { LogoutAllUseCase } from './application/use-cases/logout-all.use-case';
import { LogoutDeviceUseCase } from './application/use-cases/logout-device.use-case';
import { DeviceController } from './presentation/controllers/device.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [
    {
      provide: DEVICE_REPOSITORY,
      useClass: PrismaDeviceRepository,
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
