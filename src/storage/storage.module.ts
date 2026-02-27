import { Module } from '@nestjs/common';
import { S3StorageService } from './infrastructure/s3/s3-storage.service';
import { PrismaMediaRepository } from './infrastructure/prisma/repositories/prisma-media.repository';
import { MEDIA_REPOSITORY, STORAGE_SERVICE } from './storage.constants';
import { DeleteMediaUseCase } from './application/use-cases/delete-media.use-case';
import { UploadMediaUseCase } from './application/use-cases/upload-media.use-case';
import { MediaController } from './presentation/controllers/media.controller';

@Module({
  providers: [
    {
      provide: STORAGE_SERVICE,
      useClass: S3StorageService,
    },
    {
      provide: MEDIA_REPOSITORY,
      useClass: PrismaMediaRepository,
    },
    UploadMediaUseCase,
    DeleteMediaUseCase,
  ],
  exports: [
    STORAGE_SERVICE,
    MEDIA_REPOSITORY,
    UploadMediaUseCase,
    DeleteMediaUseCase,
  ],
  controllers: [MediaController],
})
export class StorageModule {}
