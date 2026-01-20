import { Device as PrismaDevice, Prisma } from '@prisma/client';
import { Device, DeviceProps } from 'src/device/domain/entities/device.entity';

export class PrismaDeviceMapper {
  static toDomain(device: PrismaDevice): Device {
    const {id, ...rest} = device;
    return Device.create(rest, id);
  }

  static toCreatePersistence(device: DeviceProps, id?: number): Prisma.DeviceUncheckedCreateInput {
    return {
      id,
      userId: device.userId,
      userAgent: device.userAgent,
      ip: device.ip,
      jti: device.jti,
      lastActive: device.lastActive,
      isActive: device.isActive,
    };
  }

  static toUpdatePersistence(device: DeviceProps, id?: number): Prisma.DeviceUncheckedUpdateInput {
    return {
      id,
      userId: device.userId,
      userAgent: device.userAgent,
      ip: device.ip,
      jti: device.jti,
      lastActive: device.lastActive,
      isActive: device.isActive,
    };
  }
}
