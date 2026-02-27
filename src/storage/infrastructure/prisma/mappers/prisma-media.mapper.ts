import { Media } from 'src/storage/domain/entites/media.entity';
import { Prisma, Media as PrismaMedia } from '@prisma/client';

export class PrismaMediaMapper {
  static toDomain(media: PrismaMedia): Media {
    return new Media(
      {
        url: media.url,
        key: media.key,
        type: media.type,
        size: media.size,
        userId: media.userId,
      },
      media.id,
    );
  }

  static toPersistence(
    media: Media,
    id: number,
  ): Prisma.MediaUncheckedCreateInput {
    return {
      id,
      url: media.getUrl(),
      key: media.getKey(),
      type: media.getType(),
      size: media.getSize(),
      userId: media.getUserId(),
    };
  }
}
