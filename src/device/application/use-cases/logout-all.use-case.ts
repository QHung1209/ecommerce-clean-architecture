import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_CACHE_SERVICE } from 'src/auth/auth.constants';
import type { UserCacheServiceInterface } from 'src/auth/domain/interfaces/user-cache.service.interface';
import { DEVICE_REPOSITORY } from 'src/device/device.constants';
import type { DeviceRepositoryInterface } from 'src/device/domain/interfaces/device-repository.interface';
import type { UserRepositoryInterface } from 'src/user/domain/interfaces/user-repository.interface';
import { USER_REPOSITORY } from 'src/user/user.constants';

@Injectable()
export class LogoutAllUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
    @Inject(DEVICE_REPOSITORY)
    private readonly deviceRepository: DeviceRepositoryInterface,
    @Inject(USER_CACHE_SERVICE)
    private readonly userCacheService: UserCacheServiceInterface,
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
