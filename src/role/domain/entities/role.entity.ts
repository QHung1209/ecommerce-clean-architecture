import { Permission } from 'src/permission/domain/entities/permission.entity';
import { BaseEntity } from 'src/shared/domain/entities/entity';

export interface RoleProps {
  name: string;
  description: string;
  isActive: boolean;
  permissions?: Permission[];
}

export class Role extends BaseEntity<RoleProps> {
  constructor(props: RoleProps, id?: number) {
    super(props, id);
  }

  getName(): string {
    return this.props.name;
  }

  getDescription(): string {
    return this.props.description;
  }

  getIsActive(): boolean {
    return this.props.isActive;
  }

  getPermissions(): Permission[] | [] {
    return this.props.permissions || [];
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

  static create(props: RoleProps, id?: number) {
    return new Role(props, id);
  }

  update(props: Partial<RoleProps>) {
    this.props = { ...this.props, ...props };
    return this;
  }

  removePermission(permissionId: number) {
    this.props.permissions = this.props.permissions?.filter(
      (permission) => permission.getId() !== permissionId,
    );
  }
}
