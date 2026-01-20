import { Inject, Injectable } from '@nestjs/common';
import { DEVICE_REPOSITORY } from 'src/device/device.constants';
import { Device, DeviceProps } from 'src/device/domain/entities/device.entity';
import type { DeviceRepositoryInterface } from 'src/device/domain/interfaces/device-repository.interface';
export interface CreateDeviceCommand {
  userAgent: string;
  ip: string;
  userId: number;
  jti: string;
}
@Injectable()
export class CreateDeviceUseCase {
  constructor(
    @Inject(DEVICE_REPOSITORY)
    private readonly deviceRepository: DeviceRepositoryInterface,
  ) {}

  async execute(data: CreateDeviceCommand) {
    let device = await this.deviceRepository.findByUserIdAndDeviceAndIp(
      data.userId,
      data.userAgent,
      data.ip,
    );
    const dataDevice = {
      ...data,
      lastActive: new Date(),
      jti: data.jti,
      isActive: true,
    };
    if (device) {
      device.update(dataDevice);
    } else {
      device = Device.create(dataDevice);
    }
    return await this.deviceRepository.save(device);
  }
}
