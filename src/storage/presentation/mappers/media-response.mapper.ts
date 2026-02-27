import { Media } from 'src/storage/domain/entites/media.entity';

export class MediaResponseMapper {
  static toResponse(media: Media) {
    return {
      id: media.getId(),
      url: media.getUrl(),
      key: media.getKey(),
      type: media.getType(),
      size: media.getSize(),
      userId: media.getUserId(),
    };
  }

  static toResponseList(medias: Media[]) {
    return {
      data: medias.map((media) => this.toResponse(media)),
    };
  }
}
