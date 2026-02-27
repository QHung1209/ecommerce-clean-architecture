import { Media } from 'src/storage/domain/entites/media.entity';
import type { IStorageService } from 'src/storage/domain/interfaces/storage-service.interface';
import type { IMediaRepository } from 'src/storage/domain/interfaces/media-repository.interface';
import { Inject } from '@nestjs/common';
import {
  MEDIA_REPOSITORY,
  STORAGE_SERVICE,
} from 'src/storage/storage.constants';

export class UploadMediaUseCase {
  constructor(
    @Inject(STORAGE_SERVICE)
    private readonly storageService: IStorageService,
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepository: IMediaRepository,
  ) {}
  async execute(
    files: Express.Multer.File[],
    folder: string,
    createdById: number,
  ): Promise<Media[]> {
    const data = await this.storageService.uploadFiles(files, folder);
    const medias = await Promise.all(
      data.map((item) =>
        this.mediaRepository.save(
          new Media({
            url: item.url,
            key: item.key,
            type: item.type,
            size: item.size,
            userId: createdById,
          }),
          createdById,
        ),
      ),
    );
    return medias;
  }
}
