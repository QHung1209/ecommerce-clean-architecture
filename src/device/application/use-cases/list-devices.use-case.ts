import { Inject, Injectable } from '@nestjs/common';
import { DEVICE_REPOSITORY } from 'src/device/device.constants';
import type { IDeviceRepository } from 'src/device/domain/interfaces/device-repository.interface';
import { ISharedQuery } from 'src/shared/domain/interfaces/query.interface';

@Injectable()
export class ListDevicesUseCase {
  constructor(
    @Inject(DEVICE_REPOSITORY)
    private readonly deviceRepository: IDeviceRepository,
  ) {}

  async execute(query: ISharedQuery, userId: number) {
    const devices = await this.deviceRepository.findAllByUserId(query, userId);
    const total = await this.deviceRepository.countByUserId(userId);
    return {
      data: devices,
      total,
      totalPages: Math.ceil(total / query.limit),
      currentPage: query.page,
    };
  }
}
