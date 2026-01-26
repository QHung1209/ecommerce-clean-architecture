import { User, UserProps } from '../entities/user.entity';
import { IBaseRepository } from 'src/shared/domain/interfaces/base-repository.interface';

export interface IUserRepository extends IBaseRepository<User, number> {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByRoleId(roleId: number): Promise<User[]>;
  getTokenVersionByUserId(id: number): Promise<number | null>;
}
