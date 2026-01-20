import { User, UserProps } from '../entities/user.entity';
import { BaseRepositoryInterface } from 'src/shared/domain/interfaces/base-repository.interface';

export interface UserRepositoryInterface extends BaseRepositoryInterface<User, number> {
  save(user: User): Promise<User>
  findByEmail(email: string): Promise<User | null>;
  findByRoleId(roleId: number): Promise<User[]>;
  getTokenVersionByUserId(id: number): Promise<number | null>;
}
