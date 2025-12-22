import { Permission } from "src/permission/domain/entities/permission.entity";

export interface RoleProps {
  name: string;
  description: string;
  isActive: boolean;
  permissions: Permission[] | [];
}

export class Role {
  constructor(
    public readonly id: number,
    private props: RoleProps,
  ) {}

  getName(): string {
    return this.props.name;
  }

  getDescription(): string {
    return this.props.description;
  }

  getIsActive(): boolean {
    return this.props.isActive;
  }

  getPermissions(): Permission[] {
    return this.props.permissions;
  }

  isActive(): boolean {
    return this.props.isActive;
  }

  activate(): void {
    this.props.isActive = true;
  }

  deactivate(): void {
    this.props.isActive = false;
  }
}
