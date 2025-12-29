import { CreateUserDto } from 'src/user/presentation/dto/create-user.dto';
import { User, UserProps } from '../entities/user.entity';

export interface UserRepositoryInterface {
  create(data: CreateUserDto): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  findByRoleId(roleId: number): Promise<User[]>;
  update(id: number, data: UserProps): Promise<User>;
  delete(id: number): Promise<void>;
}
