import { Inject, Injectable } from '@nestjs/common';
import { DEVICE_REPOSITORY } from 'src/device/device.constants';
import { Device } from 'src/device/domain/entities/device.entity';
import type { IDeviceRepository } from 'src/device/domain/interfaces/device-repository.interface';

type CreateDeviceCommand = {
  userAgent: string;
  ip: string;
  userId: number;
  jti: string;
};

@Injectable()
export class CreateDeviceUseCase {
  constructor(
    @Inject(DEVICE_REPOSITORY)
    private readonly deviceRepository: IDeviceRepository,
  ) {}

  async execute(data: CreateDeviceCommand) {
    let device = await this.deviceRepository.findByUserIdAndDeviceAndIp(
      data.userId,
      data.userAgent,
      data.ip,
    );
    if (device) {
      device.updateOnLogin({
        jti: data.jti,
        userAgent: data.userAgent,
        ip: data.ip,
      });
    } else {
      device = Device.create({
        userId: data.userId,
        userAgent: data.userAgent,
        ip: data.ip,
        jti: data.jti,
      });
    }
    return await this.deviceRepository.save(device);
  }
}
