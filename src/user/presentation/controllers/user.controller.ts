import {
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/presentation/guards/jwt-auth.guard';
import { UserStatus } from 'src/user/domain/entities/user.entity';
import { CreateUserUseCase } from 'src/user/application/use-cases/create-user.use-case';
import { GetUserUseCase } from 'src/user/application/use-cases/get-user.use-case';
import { UpdateUserUseCase } from 'src/user/application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from 'src/user/application/use-cases/delete-user.use-case';
import { ListUsersUseCase } from 'src/user/application/use-cases/list-users.use-case';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserResponseMapper } from '../mappers/user-response.mapper';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
  ) {}

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.listUsersUseCase.execute();
    return users.map((user) => UserResponseMapper.toResponse(user));
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<UserResponseDto> {
    const user = await this.getUserUseCase.execute(id);
    return UserResponseMapper.toResponse(user);
  }

  @Post()
  async create(@Body() body: CreateUserDto): Promise<UserResponseDto> {
    const userData = {
      ...body,
      status: body.status || UserStatus.INACTIVE,
    };
    const newUser = await this.createUserUseCase.execute(userData);
    return UserResponseMapper.toResponse(newUser);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const updatedUser = await this.updateUserUseCase.execute(id, body);
    return UserResponseMapper.toResponse(updatedUser);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.deleteUserUseCase.execute(id);
  }
}
