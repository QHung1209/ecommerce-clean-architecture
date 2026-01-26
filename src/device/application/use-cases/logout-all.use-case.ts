import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_CACHE_SERVICE } from 'src/auth/auth.constants';
import type { IUserCacheService } from 'src/auth/domain/interfaces/user-cache.service.interface';
import { DEVICE_REPOSITORY } from 'src/device/device.constants';
import type { IDeviceRepository } from 'src/device/domain/interfaces/device-repository.interface';
import type { IUserRepository } from 'src/user/domain/interfaces/user-repository.interface';
import { USER_REPOSITORY } from 'src/user/user.constants';

@Injectable()
export class LogoutAllUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(DEVICE_REPOSITORY)
    private readonly deviceRepository: IDeviceRepository,
    @Inject(USER_CACHE_SERVICE)
    private readonly userCacheService: IUserCacheService,
  ) {}

  async execute(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.setTokenVersion(user.getTokenVersion() + 1);
    await Promise.all([
      this.userRepository.save(user),
      this.deviceRepository.deleteAll(id),
      this.userCacheService.deleteTokenVersionByUserId(id),
    ]);
  }
}
