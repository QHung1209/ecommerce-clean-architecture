import {
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateRoleDto } from 'src/role/presentation/dto/create-role.dto';
import { CreateRoleUseCase } from 'src/role/application/use-case/create-role.use-case';
import { Post } from '@nestjs/common';
import { Body, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/presentation/guards/jwt-auth.guard';
import { RoleResponseMapper } from '../mappers/role-response.mapper';
import { RoleResponseDto } from '../dto/role-response.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { UpdateRoleUseCase } from 'src/role/application/use-case/update-role.use-case';
import { DeleteRoleUseCase } from 'src/role/application/use-case/delete-role.use-case';
import { ListRolesUseCase } from 'src/role/application/use-case/list-roles.use-case';
import { GetRoleUseCase } from 'src/role/application/use-case/get-role.use-case';
import { SharedQueryDto } from 'src/shared/presentation/dto/shared.dto';

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
    private readonly listRolesUseCase: ListRolesUseCase,
    private readonly getRoleUseCase: GetRoleUseCase,
  ) {}

  @Get()
  async findAll(@Query() queryDto: SharedQueryDto): Promise<RoleResponseDto[]> {
    const roles = await this.listRolesUseCase.execute(queryDto);
    return roles.map((role) => RoleResponseMapper.toResponse(role));
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<RoleResponseDto> {
    const role = await this.getRoleUseCase.execute(id);
    return RoleResponseMapper.toResponse(role);
  }

  @Post()
  async create(
    @Body() body: CreateRoleDto,
    @Req() req: any,
  ): Promise<RoleResponseDto> {
    const newRole = await this.createRoleUseCase.execute(body, req.user.id);
    return RoleResponseMapper.toResponse(newRole);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateRoleDto,
    @Req() req: any,
  ): Promise<RoleResponseDto> {
    const updatedRole = await this.updateRoleUseCase.execute(
      id,
      body,
      req.user.id,
    );
    return RoleResponseMapper.toResponse(updatedRole);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.deleteRoleUseCase.execute(id);
  }
}
