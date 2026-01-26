import { ISharedQuery } from './query.interface';

export interface IBaseRepository<T, ID = number> {
  findById(id: ID): Promise<T | null>;
  findAll(query: ISharedQuery): Promise<T[]>;
  delete(id: ID): Promise<void>;
}
