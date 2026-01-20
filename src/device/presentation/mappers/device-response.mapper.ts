import { Device } from "src/device/domain/entities/device.entity";

export interface PaginatedDeviceResult {
  devices: Device[];
  total: number;
  totalPage: number;
  page: number;
}

export class DeviceResponseMapper {
  static toResponse(device: Device) {
    return {
      id: device.getId(),
      ip: device.getIp(),
      lastActive: device.getLastActive(),
      userAgent: device.getUserAgent()
    };
  }

  static toResponseList(devices: Device[]) {
    return devices.map((device) => this.toResponse(device));
  }

  static toPaginatedResponse(result: PaginatedDeviceResult) {
    return {
      devices: this.toResponseList(result.devices),
      total: result.total,
      totalPage: result.totalPage,
      page: result.page,
    };
  }
}
