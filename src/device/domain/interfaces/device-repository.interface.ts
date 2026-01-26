import { ISharedQuery } from 'src/shared/domain/interfaces/query.interface';
import { Device, DeviceProps } from '../entities/device.entity';
import { IBaseRepository } from 'src/shared/domain/interfaces/base-repository.interface';

export interface IDeviceRepository extends IBaseRepository<Device, number> {
  save(device: Device): Promise<Device>;
  findAllByUserId(query: ISharedQuery, userId: number): Promise<Device[]>;
  deleteAll(userId: number): Promise<void>;
  findByUserIdAndDeviceAndIp(
    userId: number,
    userAgent: string,
    ip: string,
  ): Promise<Device | null>;
  countByUserId(userId: number): Promise<number>;
  findByJti(jti: string): Promise<Device | null>;
}
