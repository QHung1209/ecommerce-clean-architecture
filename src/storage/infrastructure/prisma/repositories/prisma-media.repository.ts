import { IMediaRepository } from 'src/storage/domain/interfaces/media-repository.interface';
import { Media } from 'src/storage/domain/entites/media.entity';
import { PrismaService } from 'src/shared/infrastructure/databases/prisma/prisma.service';
import { PrismaMediaMapper } from '../mappers/prisma-media.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaMediaRepository implements IMediaRepository {
  constructor(private readonly prisma: PrismaService) {}
  async save(media: Media, createdById: number): Promise<Media> {
    const savedMedia = media.hasId()
      ? await this.prisma.media.update({
          where: {
            deletedAt: null,
            id: media.getId(),
          },
          data: {
            url: media.getUrl(),
            key: media.getKey(),
            type: media.getType(),
            size: media.getSize(),
            userId: media.getUserId(),
            updatedById: createdById,
          },
        })
      : await this.prisma.media.create({
          data: {
            url: media.getUrl(),
            key: media.getKey(),
            type: media.getType(),
            size: media.getSize(),
            userId: media.getUserId(),
            createdById: createdById,
          },
        });
    return PrismaMediaMapper.toDomain(savedMedia);
  }

  async delete(id: number, deletedById: number): Promise<void> {
    await this.prisma.media.update({
      where: {
        id,
      },
      data: {
        deletedById,
        deletedAt: new Date(),
      },
    });
  }
  async findById(id: number): Promise<Media | null> {
    const media = await this.prisma.media.findUnique({
      where: {
        id,
      },
    });
    return media ? PrismaMediaMapper.toDomain(media) : null;
  }
  findAll(): Promise<Media[]> {
    throw new Error('Method not implemented.');
  }
  count(): Promise<number> {
    throw new Error('Method not implemented.');
  }

  findAllByIds(ids: number[]): Promise<Media[]> {
    throw new Error('Method not implemented.');
  }
  async findByUrl(url: string): Promise<Media | null> {
    const media = await this.prisma.media.findFirst({
      where: {
        url,
      },
    });
    return media ? PrismaMediaMapper.toDomain(media) : null;
  }
  async findByUserId(userId: number): Promise<Media[]> {
    const medias = await this.prisma.media.findMany({
      where: {
        userId,
      },
    });
    return medias.map((media) => PrismaMediaMapper.toDomain(media));
  }
}
