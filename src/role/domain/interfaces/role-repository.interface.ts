import { SharedQueryDto } from "src/shared/presentation/dto/shared.dto";
import { Role } from "../entities/role.entity";
import { CreateRoleDto } from "src/role/presentation/dto/create-role.dto";
import { UpdateRoleDto } from "src/role/presentation/dto/update-role.dto";

export interface RoleRepositoryInterface {
    create(role: CreateRoleDto, createdById: number): Promise<Role>;
    update(id: number, role: UpdateRoleDto, updatedById: number): Promise<Role>;
    delete(id: number): Promise<void>;
    findById(id: number): Promise<Role | null>;
    findAll(queryDto: SharedQueryDto): Promise<Role[]>;
    count(): Promise<number>;
}
