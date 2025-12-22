import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { CreatePermissionUseCase } from "src/permission/application/user-case/create-permission.use-case";
import { DeletePermissionUseCase } from "src/permission/application/user-case/delete-permission.use-case";
import { GetPermissionUseCase } from "src/permission/application/user-case/get-permission.use-case";
import { ListPermissionsUseCase } from "src/permission/application/user-case/list-permissions.use-case";
import { UpdatePermissionUseCase } from "src/permission/application/user-case/update-permission.use-case";
import { CreatePermissionDto } from "../dto/create-permission.dto";
import { JwtAuthGuard } from "src/auth/presentation/guards/jwt-auth.guard";
import { UpdatePermissionDto } from "../dto/update-permission.dto";
import { GetPermissionDto, ListPermissionsDto } from "../dto/get-permission.dto";

@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class PermissionController {
    constructor(
        private readonly getPermissionUseCase: GetPermissionUseCase,
        private readonly listPermissionsUseCase: ListPermissionsUseCase,
        private readonly createPermissionUseCase: CreatePermissionUseCase,
        private readonly updatePermissionUseCase: UpdatePermissionUseCase,
        private readonly deletePermissionUseCase: DeletePermissionUseCase,
    ) {}

    @Get(':id')
    async getPermission(@Param() param: GetPermissionDto) {
        return this.getPermissionUseCase.execute(param.id);
    }

    @Get()
    async listPermissions(@Query() query: ListPermissionsDto) {
        return this.listPermissionsUseCase.execute(query);
    }

    @Post()
    async createPermission(@Body() createPermissionDto: CreatePermissionDto, @Req() req: any) {
        return this.createPermissionUseCase.execute(createPermissionDto, req.user.id);
    }

    @Put(':id')
    async updatePermission(@Param() param: GetPermissionDto, @Body() updatePermissionDto: UpdatePermissionDto, @Req() req: any) {
        return this.updatePermissionUseCase.execute(param.id, updatePermissionDto, req.user.id);
    }

    @Delete(':id')
    async deletePermission(@Param() param: GetPermissionDto, @Req() req: any) {
        return this.deletePermissionUseCase.execute(param.id);
    }
}
