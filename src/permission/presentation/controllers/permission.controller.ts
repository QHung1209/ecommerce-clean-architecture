import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreatePermissionUseCase } from 'src/permission/application/use-cases/create-permission.use-case';
import { DeletePermissionUseCase } from 'src/permission/application/use-cases/delete-permission.use-case';
import { GetPermissionUseCase } from 'src/permission/application/use-cases/get-permission.use-case';
import { ListPermissionsUseCase } from 'src/permission/application/use-cases/list-permissions.use-case';
import { UpdatePermissionUseCase } from 'src/permission/application/use-cases/update-permission.use-case';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards/jwt-auth.guard';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import {
  GetPermissionDto,
  ListPermissionsDto,
} from '../dto/get-permission.dto';
import { PermissionResponseMapper } from '../mappers/permission-response.mapper';

@Controller('permissions')
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
    const permission = await this.getPermissionUseCase.execute(param.id);
    return PermissionResponseMapper.toResponse(permission);
  }

  @Get()
  async listPermissions(@Query() query: ListPermissionsDto) {
    const permissions = await this.listPermissionsUseCase.execute(query);
    return PermissionResponseMapper.toPaginatedResponse(permissions);
  }

  @Post()
  async createPermission(
    @Body() createPermissionDto: CreatePermissionDto,
    @Req() req: any,
  ) {
    const permission = await this.createPermissionUseCase.execute(
      createPermissionDto,
      req.user.id,
    );
    return PermissionResponseMapper.toResponse(permission);
  }

  @Put(':id')
  async updatePermission(
    @Param() param: GetPermissionDto,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @Req() req: any,
  ) {
    const permission = await this.updatePermissionUseCase.execute(
      param.id,
      updatePermissionDto,
      req.user.id,
    );
    return PermissionResponseMapper.toResponse(permission);
  }

  @Delete(':id')
  async deletePermission(@Param() param: GetPermissionDto, @Req() req: any) {
    await this.deletePermissionUseCase.execute(param.id, req.user.id);
  }
}
