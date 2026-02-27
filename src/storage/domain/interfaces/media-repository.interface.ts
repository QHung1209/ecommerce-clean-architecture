import { IBaseRepository } from 'src/shared/domain/interfaces/base-repository.interface';
import { Media } from '../entites/media.entity';

export interface IMediaRepository extends IBaseRepository<Media, number> {
  save(media: Media, createdById: number): Promise<Media>;
  findAllByIds(ids: number[]): Promise<Media[]>;
  findByUrl(url: string): Promise<Media | null>;
  findByUserId(userId: number): Promise<Media[]>;
}
