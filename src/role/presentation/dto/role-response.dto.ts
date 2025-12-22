export class RoleResponseDto {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  permissions: {
    id: number;
    name: string;
    method: string;
    path: string;
  }[];
}
