import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DEVICE_REPOSITORY } from 'src/device/device.constants';
import type { IDeviceRepository } from 'src/device/domain/interfaces/device-repository.interface';

@Injectable()
export class DeleteDeviceUseCase {
  constructor(
    @Inject(DEVICE_REPOSITORY)
    private readonly deviceRepository: IDeviceRepository,
  ) {}

  async execute(id: number) {
    const device = await this.deviceRepository.findById(id);
    if (!device) {
      throw new NotFoundException('Device not found');
    }
    await this.deviceRepository.delete(id);
  }
}
