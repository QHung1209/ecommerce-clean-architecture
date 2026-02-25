import { Device } from 'src/device/domain/entities/device.entity';
import { PaginatedResult } from 'src/shared/presentation/mappers/pagination.interface';

type PaginatedDeviceResult = {
  devices: Device[];
  total: number;
  totalPage: number;
  page: number;
};

export class DeviceResponseMapper {
  static toResponse(device: Device) {
    return {
      id: device.getId(),
      ip: device.getIp(),
      lastActive: device.getLastActive(),
      userAgent: device.getUserAgent(),
    };
  }

  static toResponseList(devices: Device[]) {
    return devices.map((device) => this.toResponse(device));
  }

  static toPaginatedResponse(result: PaginatedResult<Device>) {
    return {
      data: this.toResponseList(result.data),
      meta: {
        total: result.total,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
      },
    };
  }
}
