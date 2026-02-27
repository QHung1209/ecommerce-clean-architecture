import { BaseEntity } from 'src/shared/domain/entities/entity';

export type MediaProps = {
  userId: number;
  url: string;
  key: string;
  type: string;
  size: number;
};

export class Media extends BaseEntity<MediaProps> {
  constructor(props: MediaProps, id?: number) {
    super(props, id);
  }
  getUserId(): number {
    return this.props.userId;
  }
  getUrl(): string {
    return this.props.url;
  }
  getKey(): string {
    return this.props.key;
  }
  getType(): string {
    return this.props.type;
  }
  getSize(): number {
    return this.props.size;
  }
  update(data: MediaProps): void {
    this.props = { ...this.props, ...data };
  }
  static create(props: MediaProps, id?: number): Media {
    return new Media(props, id);
  }
}
