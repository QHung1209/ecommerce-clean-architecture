import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  TOKEN_CACHE_SERVICE,
} from 'src/auth/auth.constants';
import type { TokenCacheServiceInterface } from 'src/auth/domain/interfaces/token-cache.service.interface';
import { DEVICE_REPOSITORY } from 'src/device/device.constants';
import type { DeviceRepositoryInterface } from 'src/device/domain/interfaces/device-repository.interface';

@Injectable()
export class LogoutDeviceUseCase {
  constructor(
    @Inject(DEVICE_REPOSITORY)
    private readonly deviceRepository: DeviceRepositoryInterface,

    @Inject(TOKEN_CACHE_SERVICE)
    private readonly tokenCacheService: TokenCacheServiceInterface,

    private readonly configService: ConfigService,

  ) {}

  async execute(id: number) {
    const device = await this.deviceRepository.findById(id);
    if (!device) {
      throw new NotFoundException('Device not found');
    }
    const ttlDefault = this.configService.get('JWT_REFRESH_EXPIRES_IN');
    await this.tokenCacheService.addTokenToBlacklist(
      device.getJti(),
      +ttlDefault,
    );
    await this.deviceRepository.delete(id);
  }
}
