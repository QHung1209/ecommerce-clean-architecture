import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TOKEN_CACHE_SERVICE } from 'src/auth/auth.constants';
import type { ITokenCacheService } from 'src/auth/domain/interfaces/token-cache.service.interface';
import { DEVICE_REPOSITORY } from 'src/device/device.constants';
import type { IDeviceRepository } from 'src/device/domain/interfaces/device-repository.interface';

export const REFRESH_TOKEN_TTL = 'REFRESH_TOKEN_TTL';

@Injectable()
export class LogoutDeviceUseCase {
  constructor(
    @Inject(DEVICE_REPOSITORY)
    private readonly deviceRepository: IDeviceRepository,

    @Inject(TOKEN_CACHE_SERVICE)
    private readonly tokenCacheService: ITokenCacheService,

    @Inject(REFRESH_TOKEN_TTL)
    private readonly refreshTokenTtl: number,
  ) {}

  async execute(id: number) {
    const device = await this.deviceRepository.findById(id);
    if (!device) {
      throw new NotFoundException('Device not found');
    }
    await this.tokenCacheService.addTokenToBlacklist(
      device.getJti(),
      this.refreshTokenTtl,
    );
    await this.deviceRepository.delete(id);
  }
}
