import { Inject, Injectable } from '@nestjs/common';
import { DEVICE_REPOSITORY } from 'src/device/device.constants';
import type { IDeviceRepository } from 'src/device/domain/interfaces/device-repository.interface';

@Injectable()
export class DeleteAllDeviceUseCase {
  constructor(
    @Inject(DEVICE_REPOSITORY)
    private readonly deviceRepository: IDeviceRepository,
  ) {}

  async execute(userId: number) {
    await this.deviceRepository.deleteAll(userId);
  }
}
