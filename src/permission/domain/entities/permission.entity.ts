import { BaseEntity } from 'src/shared/domain/entities/entity';
import { HTTPMethod } from 'src/shared/domain/enums/http-method.enum';

export type PermissionProps = {
  name: string;
  description: string;
  path: string;
  method: HTTPMethod;
};

export class Permission extends BaseEntity<PermissionProps> {
  constructor(props: PermissionProps, id?: number) {
    super(props, id);
  }

  getName(): string {
    return this.props.name;
  }

  getDescription(): string {
    return this.props.description;
  }

  getPath(): string {
    return this.props.path;
  }

  getMethod(): string {
    return this.props.method;
  }

  toJSON() {
    return {
      id: this.id,
      ...this.props,
    };
  }

  static create(props: PermissionProps, id?: number): Permission {
    return new Permission(props, id);
  }

  update(props: PermissionProps) {
    this.props = { ...this.props, ...props };
  }
}
