import { Inject, NotFoundException } from '@nestjs/common';
import {
  MEDIA_REPOSITORY,
  STORAGE_SERVICE,
} from 'src/storage/storage.constants';
import type { IMediaRepository } from 'src/storage/domain/interfaces/media-repository.interface';
import type { IStorageService } from 'src/storage/domain/interfaces/storage-service.interface';

export class DeleteMediaUseCase {
  constructor(
    @Inject(STORAGE_SERVICE)
    private readonly storageService: IStorageService,
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepository: IMediaRepository,
  ) {}
  async execute(url: string, deletedById: number) {
    const media = await this.mediaRepository.findByUrl(url);
    if (!media) {
      throw new NotFoundException('Media not found');
    }
    await Promise.all([
      this.storageService.deleteFile(media.getKey()),
      this.mediaRepository.delete(media.getId()!, deletedById),
    ]);
  }
}
