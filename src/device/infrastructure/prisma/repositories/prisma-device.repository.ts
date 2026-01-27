import { Injectable } from '@nestjs/common';
import { Device, DeviceProps } from 'src/device/domain/entities/device.entity';
import { IDeviceRepository } from 'src/device/domain/interfaces/device-repository.interface';
import { PrismaService } from 'src/shared/infrastructure/databases/prisma/prisma.service';
import { PrismaDeviceMapper } from '../mappers/prisma-device.mapper';
import { ISharedQuery } from 'src/shared/domain/interfaces/query.interface';

@Injectable()
export class PrismaDeviceRepository implements IDeviceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(device: Device) {
    const savedDevice = device.hasId()
      ? await this.prisma.device.update({
          where: {
            id: device.getId(),
          },
          data: {
            ...PrismaDeviceMapper.toUpdatePersistence(
              device.getProps(),
              device.getId(),
            ),
          },
        })
      : await this.prisma.device.create({
          data: {
            ...PrismaDeviceMapper.toCreatePersistence(
              device.getProps(),
              device.getId(),
            ),
          },
        });
    return PrismaDeviceMapper.toDomain(savedDevice);
  }

  async findById(id: number) {
    const device = await this.prisma.device.findUnique({
      where: {
        id: id,
      },
    });
    return device ? PrismaDeviceMapper.toDomain(device) : null;
  }

  async findAllByUserId(query: any, userId: number) {
    const devices = await this.prisma.device.findMany({
      where: {
        userId: userId,
      },
      take: query.limit,
      skip: (query.page - 1) * query.limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return devices.map((device) => PrismaDeviceMapper.toDomain(device));
  }

  async delete(id: number) {
    await this.prisma.device.delete({
      where: {
        id: id,
      },
    });
  }

  async deleteAll(userId: number) {
    await this.prisma.device.deleteMany({
      where: {
        userId: userId,
      },
    });
  }

  async countByUserId(userId: number) {
    return await this.prisma.device.count({
      where: {
        userId: userId,
      },
    });
  }

  async findByUserIdAndDeviceAndIp(
    userId: number,
    userAgent: string,
    ip: string,
  ) {
    const device = await this.prisma.device.findFirst({
      where: {
        userId: userId,
        userAgent: userAgent,
        ip: ip,
      },
    });
    return device ? PrismaDeviceMapper.toDomain(device) : null;
  }

  async count() {
    return await this.prisma.device.count();
  }

  async findAll(query: ISharedQuery): Promise<Device[]> {
    const devices = await this.prisma.device.findMany({
      take: query.limit,
      skip: (query.page - 1) * query.limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return devices.map((device) => PrismaDeviceMapper.toDomain(device));
  }

  async findByJti(jti: string) {
    const device = await this.prisma.device.findUnique({
      where: {
        jti: jti,
      },
    });
    return device ? PrismaDeviceMapper.toDomain(device) : null;
  }
}
