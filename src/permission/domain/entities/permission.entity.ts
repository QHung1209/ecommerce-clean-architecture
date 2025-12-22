import { HTTPMethod } from '@prisma/client';

export interface PermissionProps {
  name: string;
  description: string;
  path: string;
  method: HTTPMethod;
}

export class Permission {
  constructor(
    public readonly id: number,
    private props: PermissionProps,
  ) {}

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
}
